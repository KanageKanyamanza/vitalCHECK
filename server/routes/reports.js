const express = require('express');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { generatePDFReport, generateSimplePDFReport } = require('../utils/pdfGenerator');
const { sendEmail, sendAccountCreatedAfterAssessment } = require('../utils/emailService');
const { sendEmailExternal } = require('../utils/emailServiceExternal');
const { emailTemplates } = require('../utils/emailTemplates');
const router = express.Router();

// Download PDF report from database
router.get('/download/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('user', 'email companyName sector companySize');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    if (!assessment.pdfBuffer) {
      return res.status(404).json({ 
        success: false, 
        message: 'PDF report not found' 
      });
    }

    const filename = `VitalCheck-Health-Check-${assessment.user.companyName}-${new Date(assessment.completedAt).toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(assessment.pdfBuffer);

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error downloading PDF report' 
    });
  }
});

// Generate and send report
router.post('/generate/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('user', 'email companyName sector companySize hasAccount accountCreatedAt tempPassword');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    // Note: Le compte est déjà créé lors de la soumission de l'évaluation (voir assessments.js)
    // Pas besoin de recréer le compte ici pour éviter d'envoyer 2 emails avec 2 mots de passe différents
    
    // Generate PDF report - try complex version first, fallback to simple

    let pdfBuffer;
    try {
      pdfBuffer = await generatePDFReport(assessment);
    } catch (error) {
      pdfBuffer = await generateSimplePDFReport(assessment);
    }

    // Convert Uint8Array to Buffer for Mongoose
    const pdfBufferForDB = Buffer.from(pdfBuffer);

    // Get email template based on language
    const language = assessment.language || 'fr';
    const template = emailTemplates[language] || emailTemplates.fr;
    
    const pdfFilename = `VitalCheck-Health-Check-${assessment.user.companyName}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Toujours stocker le PDF en base de données pour le téléchargement
    try {
      assessment.pdfBuffer = pdfBufferForDB;
      assessment.pdfGeneratedAt = new Date();
      await assessment.save();
    } catch (dbError) {
      // Erreur silencieuse de stockage
    }
    
    // Send email with PDF attachment (le compte et les identifiants ont déjà été envoyés lors de la soumission)
    let emailSent = false;
    let lastError = null;

    const clientUrl = process.env.CLIENT_URL || 'https://www.checkmyenterprise.com';
    const downloadUrl = `${clientUrl}/report/download/${assessment._id}`;
    

    // Vérifier si c'est un nouveau compte pour inclure les identifiants
    // Un nouveau compte est détecté si accountCreatedAt existe et est récent (dans les 5 dernières minutes)
    const isNewAccount = assessment.user.accountCreatedAt && (Date.now() - new Date(assessment.user.accountCreatedAt).getTime()) < 300000; // Compte créé dans les 5 dernières minutes
    
    console.log('🔍 [REPORT] Vérification nouveau compte:', {
      email: assessment.user.email,
      hasAccount: assessment.user.hasAccount,
      accountCreatedAt: assessment.user.accountCreatedAt,
      isNewAccount: isNewAccount,
      timeDiff: assessment.user.accountCreatedAt ? (Date.now() - new Date(assessment.user.accountCreatedAt).getTime()) : null
    });
    
    // Pour les nouveaux comptes, récupérer le mot de passe temporaire depuis la base de données
    let tempPassword = null;
    if (isNewAccount) {
      // Le mot de passe temporaire en clair est stocké dans le champ tempPassword
      tempPassword = assessment.user.tempPassword;
      console.log('✅ [REPORT] Nouveau compte détecté, mot de passe temporaire inclus:', tempPassword ? 'OUI' : 'NON');
    } else {
      console.log('ℹ️ [REPORT] Compte existant, pas d\'identifiants à inclure');
    }
    
    const emailData = {
      to: assessment.user.email,
      subject: template.reportReady.subject,
      html: template.reportReady.html(assessment.user, assessment, downloadUrl, tempPassword),
      attachments: [{
        filename: pdfFilename,
        content: pdfBuffer
      }]
    };

    // Niveau 1: Configuration normale Nodemailer
    try {
      await sendEmail(emailData);
      emailSent = true;
    } catch (error) {
      console.log('❌ [REPORT] Erreur avec configuration normale:', {
        userEmail: assessment.user.email,
        error: error.message,
        code: error.code
      });
      lastError = error;
    }

    // Niveau 2: Service externe (EmailJS/SendGrid)
    if (!emailSent) {
      try {
        console.log('🌐 [REPORT] Tentative avec service externe...');
        await sendEmailExternal(emailData);
        emailSent = true;
      } catch (error) {
        console.log('❌ [REPORT] Erreur avec service externe:', {
          userEmail: assessment.user.email,
          error: error.message
        });
        lastError = error;
      }
    }

    if (!emailSent) {
      throw new Error(`Impossible d'envoyer l'email de rapport: ${lastError?.message || 'Erreur inconnue'}`);
    }


    // Update assessment with report status and save PDF buffer
    assessment.reportGenerated = true;
    assessment.pdfBuffer = pdfBufferForDB;
    assessment.pdfGeneratedAt = new Date();
    assessment.reportType = 'freemium';
    await assessment.save();

    // Nettoyer le mot de passe temporaire après l'envoi de l'email (sécurité)
    if (isNewAccount && assessment.user.tempPassword) {
      assessment.user.tempPassword = null;
      await assessment.user.save();
      console.log('🧹 [REPORT] Mot de passe temporaire nettoyé pour:', assessment.user.email);
    }

    // Nettoyer les brouillons d'évaluations pour cet utilisateur après génération du rapport
    try {
      const deletedDrafts = await Assessment.deleteMany({
        user: assessment.user._id,
        status: 'draft',
        _id: { $ne: assessment._id } // Ne pas supprimer l'évaluation qui vient d'avoir son rapport généré
      });
      
      if (deletedDrafts.deletedCount > 0) {
        console.log(`🧹 [REPORT-CLEANUP] ${deletedDrafts.deletedCount} brouillon(s) supprimé(s) pour ${assessment.user.companyName}`);
      }
    } catch (cleanupError) {
      console.error('❌ Erreur lors du nettoyage des brouillons après génération de rapport:', cleanupError);
      // Ne pas faire échouer la génération de rapport pour une erreur de nettoyage
    }

    res.json({
      success: true,
      message: 'Report generated and sent successfully',
      assessmentId: assessment._id
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during report generation' 
    });
  }
});

// Get report data (for client-side PDF generation)
router.get('/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('user', 'companyName email sector companySize');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    res.json({
      success: true,
      data: {
        assessment: {
          _id: assessment._id,
          overallScore: assessment.overallScore,
          overallStatus: assessment.overallStatus,
          completedAt: assessment.completedAt,
          language: assessment.language,
          answers: assessment.answers,
          categoryScores: assessment.categoryScores,
          recommendations: assessment.recommendations
        },
        user: {
          companyName: assessment.user.companyName,
          email: assessment.user.email,
          sector: assessment.user.sector,
          companySize: assessment.user.companySize
        }
      }
    });

  } catch (error) {
    console.error('Get report data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting report data'
    });
  }
});

// Get report status
router.get('/status/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId);
    
    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    res.json({
      success: true,
      reportGenerated: assessment.reportGenerated,
      reportUrl: assessment.reportUrl
    });

  } catch (error) {
    console.error('Get report status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Download saved PDF report
router.get('/download/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('user', 'companyName email sector companySize');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    // Si le PDF n'existe pas, le générer automatiquement
    if (!assessment.pdfBuffer) {
      console.log('PDF not found, generating automatically...');
      
      try {
        // Générer le PDF
        let pdfBuffer;
        try {
          pdfBuffer = await generatePDFReport(assessment);
          console.log('Complex PDF generation successful');
        } catch (error) {
          console.warn('Complex PDF generation failed, trying simple version:', error.message);
          pdfBuffer = await generateSimplePDFReport(assessment);
          console.log('Simple PDF generation successful');
        }

        // Convertir et sauvegarder
        const pdfBufferForDB = Buffer.from(pdfBuffer);
        assessment.pdfBuffer = pdfBufferForDB;
        assessment.pdfGeneratedAt = new Date();
        assessment.reportGenerated = true;
        assessment.reportType = 'freemium';
        await assessment.save();
        
        console.log('PDF generated and saved successfully');
      } catch (genError) {
        console.error('PDF generation error:', genError);
        return res.status(500).json({
          success: false,
          message: 'Error generating PDF report'
        });
      }
    }

    // Set headers for PDF download
    const filename = `VitalCheck-Health-Check-${assessment.user.companyName}-${assessment.pdfGeneratedAt.toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', assessment.pdfBuffer.length);

    // Send PDF buffer
    res.send(assessment.pdfBuffer);

  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading PDF report'
    });
  }
});

module.exports = router;
