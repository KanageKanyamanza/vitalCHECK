const express = require('express');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { generatePDFReport, generateSimplePDFReport } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailService');
const { sendEmailExternal } = require('../utils/emailServiceExternal');
const { uploadPDFToCloudinary } = require('../config/cloudinary');
const emailTemplates = require('../utils/emailTemplates');
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
      .populate('user', 'email companyName sector companySize');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

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
    
    // Upload PDF to Cloudinary for download link
    const pdfFilename = `VitalCheck-Health-Check-${assessment.user.companyName}-${new Date().toISOString().split('T')[0]}.pdf`;
    let pdfDownloadUrl = null;
    
    // Vérifier si Cloudinary est configuré
    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                   process.env.CLOUDINARY_API_KEY && 
                                   process.env.CLOUDINARY_API_SECRET;
    
    if (isCloudinaryConfigured) {
      try {
        const cloudinaryResult = await uploadPDFToCloudinary(pdfBuffer, pdfFilename);
        pdfDownloadUrl = cloudinaryResult.secure_url;
      } catch (cloudinaryError) {
        // Continuer sans le lien de téléchargement
      }
    }
    
    // Toujours stocker le PDF en base de données pour le téléchargement
    try {
      assessment.pdfBuffer = pdfBufferForDB;
      assessment.pdfGeneratedAt = new Date();
      await assessment.save();
    } catch (dbError) {
      // Erreur silencieuse de stockage
    }
    
    // Send email with PDF attachment using 3-level fallback system

    // Toujours utiliser l'URL de téléchargement depuis le serveur (plus fiable)
    const downloadUrl = `${process.env.CLIENT_URL || 'https://www.checkmyenterprise.com'}/api/reports/download/${assessment._id}`;

    const emailData = {
      to: assessment.user.email,
      subject: template.reportReady.subject,
      html: template.reportReady.html(assessment.user, assessment, downloadUrl),
      attachments: [{
        filename: pdfFilename,
        content: pdfBuffer
      }]
    };

    let emailSent = false;
    let lastError = null;

    // Niveau 1: Configuration normale Nodemailer
    try {
      console.log('📧 [REPORT] Tentative avec configuration normale...');
      await sendEmail(emailData);
      emailSent = true;
      console.log('✅ [REPORT] Email envoyé avec succès (configuration normale)');
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
        console.log('✅ [REPORT] Email envoyé avec succès (service externe)');
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

    console.log('✅ [REPORT] Rapport envoyé avec succès à:', {
      userEmail: assessment.user.email,
      companyName: assessment.user.companyName
    });

    // Update assessment with report status and save PDF buffer
    assessment.reportGenerated = true;
    assessment.pdfBuffer = pdfBufferForDB;
    assessment.pdfGeneratedAt = new Date();
    assessment.reportType = 'freemium';
    await assessment.save();

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
