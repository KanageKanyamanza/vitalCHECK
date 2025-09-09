const express = require('express');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { generatePDFReport } = require('../utils/pdfGenerator');
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

    // Generate PDF report
    const pdfBuffer = await generatePDFReport(assessment);

    // Get email template based on language
    const language = assessment.language || 'fr';
    const template = emailTemplates[language] || emailTemplates.fr;
    
    // Send email with PDF attachment
    await sendEmail({
      to: assessment.user.email,
      subject: template.reportReady.subject,
      html: template.reportReady.html(assessment.user, assessment),
      attachments: [{
        filename: `UBB-Health-Check-${assessment.user.companyName}-${new Date().toISOString().split('T')[0]}.pdf`,
        content: pdfBuffer
      }]
    });

    // Update assessment with report status and save PDF buffer
    assessment.reportGenerated = true;
    assessment.pdfBuffer = pdfBuffer;
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
      .populate('user', 'companyName');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    if (!assessment.pdfBuffer) {
      return res.status(404).json({ 
        success: false, 
        message: 'PDF report not found. Please generate the report first.' 
      });
    }

    // Set headers for PDF download
    const filename = `UBB-Health-Check-${assessment.user.companyName}-${assessment.pdfGeneratedAt.toISOString().split('T')[0]}.pdf`;
    
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

// Get report status and info
router.get('/status/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('user', 'companyName email');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    res.json({
      success: true,
      data: {
        reportGenerated: assessment.reportGenerated,
        reportType: assessment.reportType,
        pdfGeneratedAt: assessment.pdfGeneratedAt,
        hasPdfBuffer: !!assessment.pdfBuffer,
        companyName: assessment.user.companyName,
        overallScore: assessment.overallScore,
        overallStatus: assessment.overallStatus
      }
    });

  } catch (error) {
    console.error('Report status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting report status'
    });
  }
});

module.exports = router;
