const express = require('express');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { generatePDFReport, generateSimplePDFReport } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailService');
const emailTemplates = require('../utils/emailTemplates');
const router = express.Router();

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
    console.log('📄 [REPORT] Génération du PDF...', {
      assessmentId: assessment._id,
      companyName: assessment.user.companyName,
      language: assessment.language || 'fr'
    });

    let pdfBuffer;
    try {
      pdfBuffer = await generatePDFReport(assessment);
      console.log('✅ [REPORT] PDF complexe généré avec succès');
    } catch (error) {
      console.warn('⚠️ [REPORT] Échec génération PDF complexe, tentative version simple:', error.message);
      pdfBuffer = await generateSimplePDFReport(assessment);
      console.log('✅ [REPORT] PDF simple généré avec succès');
    }

    // Convert Uint8Array to Buffer for Mongoose
    const pdfBufferForDB = Buffer.from(pdfBuffer);

    // Get email template based on language
    const language = assessment.language || 'fr';
    const template = emailTemplates[language] || emailTemplates.fr;
    
    // Send email with PDF attachment
    console.log('📧 [REPORT] Envoi du rapport par email...', {
      assessmentId: assessment._id,
      userEmail: assessment.user.email,
      companyName: assessment.user.companyName,
      language: language,
      pdfSize: pdfBuffer.length + ' bytes'
    });

    await sendEmail({
      to: assessment.user.email,
      subject: template.reportReady.subject,
      html: template.reportReady.html(assessment.user, assessment),
      attachments: [{
        filename: `VitalCheck-Health-Check-${assessment.user.companyName}-${new Date().toISOString().split('T')[0]}.pdf`,
        content: pdfBuffer
      }]
    });

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
