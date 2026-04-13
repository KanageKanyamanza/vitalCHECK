const express = require('express');
const router = express.Router();
const MailingContact = require('../models/MailingContact');
const { authenticateAdmin, checkPermission } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @route   GET /api/mailing-contacts
// @desc    Get all mailing contacts with pagination and search
// @access  Admin
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';
    const source = req.query.source || '';

    const query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }
    if (source) query.source = source;

    const contacts = await MailingContact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await MailingContact.countDocuments(query);

    res.json({
      success: true,
      contacts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.error('Get mailing contacts error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   POST /api/mailing-contacts/bulk-import
// @desc    Bulk import mailing contacts
// @access  Admin
router.post('/bulk-import', authenticateAdmin, async (req, res) => {
  try {
    const { contacts } = req.body;
    if (!contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ success: false, message: 'Données invalides' });
    }

    let imported = 0;
    let updated = 0;
    let failed = 0;

    for (const contactData of contacts) {
      try {
        if (!contactData.email) {
          failed++;
          continue;
        }

        const existingContact = await MailingContact.findOne({ email: contactData.email.toLowerCase() });

        if (existingContact) {
          existingContact.firstName = contactData.firstName || existingContact.firstName;
          existingContact.lastName = contactData.lastName || existingContact.lastName;
          existingContact.companyName = contactData.companyName || existingContact.companyName;
          await existingContact.save();
          updated++;
        } else {
          const newContact = new MailingContact({
            email: contactData.email.toLowerCase(),
            firstName: contactData.firstName || '',
            lastName: contactData.lastName || '',
            companyName: contactData.companyName || '',
            source: 'import'
          });
          await newContact.save();
          imported++;
        }
      } catch (err) {
        console.error('Bulk import individual error:', err);
        failed++;
      }
    }

    res.json({
      success: true,
      message: `${imported} contacts importés, ${updated} mis à jour.`,
      stats: { imported, updated, failed }
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'importation' });
  }
});

// @route   DELETE /api/mailing-contacts/:id
// @desc    Delete a mailing contact
// @access  Admin
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await MailingContact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
