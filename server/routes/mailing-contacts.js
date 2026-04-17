const express = require('express');
const router = express.Router();
const MailingContact = require('../models/MailingContact');
const { authenticateAdmin, checkPermission } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @route   GET /api/mailing-contacts/emails-only
// @desc    Get all email addresses for duplicate checking
// @access  Admin
router.get('/emails-only', authenticateAdmin, async (req, res) => {
  try {
    const contacts = await MailingContact.find({}, 'email');
    const emails = contacts.map(c => c.email);
    res.json({ success: true, emails });
  } catch (error) {
    console.error('Get emails error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   GET /api/mailing-contacts
// @desc    Get all mailing contacts with pagination and search
// @access  Admin
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';
    const source = req.query.source || '';
    const type = req.query.type || '';

    const query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }
    if (source) query.source = source;
    if (type) query.type = type;

    const contacts = await MailingContact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await MailingContact.countDocuments(query);

    // Obtenir tous les types uniques pour le filtre
    const types = await MailingContact.distinct('type');

    res.json({
      success: true,
      contacts,
      types,
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

        const email = contactData.email.toLowerCase();
        const existingContact = await MailingContact.findOne({ email });

        if (existingContact) {
          existingContact.firstName = contactData.firstName || existingContact.firstName;
          existingContact.lastName = contactData.lastName || existingContact.lastName;
          existingContact.companyName = contactData.companyName || existingContact.companyName;
          if (contactData.type) existingContact.type = contactData.type;
          await existingContact.save();
          updated++;
        } else {
          const newContact = new MailingContact({
            email,
            firstName: contactData.firstName || '',
            lastName: contactData.lastName || '',
            companyName: contactData.companyName || '',
            type: contactData.type || 'Prospect',
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

// @route   PUT /api/mailing-contacts/:id
// @desc    Update a mailing contact
// @access  Admin
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, companyName, type, isActive } = req.body;
    
    const contact = await MailingContact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact non trouvé' });
    }

    if (email) contact.email = email.toLowerCase();
    if (firstName !== undefined) contact.firstName = firstName;
    if (lastName !== undefined) contact.lastName = lastName;
    if (companyName !== undefined) contact.companyName = companyName;
    if (type !== undefined) contact.type = type;
    if (isActive !== undefined) contact.isActive = isActive;

    await contact.save();
    res.json({ success: true, message: 'Contact mis à jour', contact });
  } catch (error) {
    console.error('Update contact error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur' });
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
