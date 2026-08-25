const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const Assessment = require('../models/Assessment');
const { authenticateClient } = require('../middleware/auth');
const { checkSubscription } = require('../middleware/checkSubscription');

const guard = [authenticateClient, checkSubscription('paid')];

// GET /api/premium-dashboard/history
// Retourne tous les assessments complétés de l'utilisateur (scores uniquement, pas les pdfBuffer)
router.get('/history', ...guard, async (req, res) => {
  try {
    const assessments = await Assessment.find({
      user: req.user._id,
      status: 'completed',
    })
      .select('_id completedAt overallScore overallLevel pillarScores version language sector companySize companyName')
      .sort({ completedAt: 1 }) // chronologique pour les graphiques
      .lean();

    res.json({ success: true, assessments });
  } catch (err) {
    console.error('[premiumDashboard] history error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/premium-dashboard/export
// Génère un fichier Excel avec tous les diagnostics de l'utilisateur
router.get('/export', ...guard, async (req, res) => {
  try {
    const assessments = await Assessment.find({
      user: req.user._id,
      status: 'completed',
    })
      .select('completedAt overallScore overallLevel pillarScores version language companyName')
      .sort({ completedAt: -1 })
      .lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'VitalCHECK';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Diagnostics');

    // Collect all unique pillar names (may vary between v1/v2)
    const pillarNames = [];
    assessments.forEach((a) => {
      (a.pillarScores || []).forEach((p) => {
        if (!pillarNames.includes(p.pillarName)) pillarNames.push(p.pillarName);
      });
    });

    // Headers
    sheet.columns = [
      { header: 'Date', key: 'date', width: 16 },
      { header: 'Entreprise', key: 'company', width: 24 },
      { header: 'Version', key: 'version', width: 10 },
      { header: 'Score Global', key: 'score', width: 14 },
      { header: 'Niveau', key: 'level', width: 18 },
      ...pillarNames.map((name) => ({ header: name, key: name, width: 22 })),
    ];

    // Style header row
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern', pattern: 'solid',
      fgColor: { argb: 'FF00751B' },
    };

    // Data rows
    assessments.forEach((a) => {
      const row = {
        date: a.completedAt ? new Date(a.completedAt).toLocaleDateString('fr-FR') : '-',
        company: a.companyName || '-',
        version: a.version || 'v2',
        score: a.overallScore != null ? Math.round(a.overallScore) : '-',
        level: a.overallLevel || '-',
      };
      pillarNames.forEach((name) => {
        const pillar = (a.pillarScores || []).find((p) => p.pillarName === name);
        row[name] = pillar ? Math.round(pillar.score) : '-';
      });
      sheet.addRow(row);
    });

    // Alternate row shading
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1 && rowNumber % 2 === 0) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FFF4' } };
      }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="vitalCHECK-diagnostics.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('[premiumDashboard] export error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
