const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { emailService } = require('../utils/emailService');

// POST /api/contact - Créer un nouveau message de contact
router.post('/', async (req, res) => {
  try {
    const { name, email, company, phone, subject, message, inquiryType } = req.body;

    // Validation des champs requis
    if (!name || !email || !subject || !message || !inquiryType) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Adresse email invalide'
      });
    }

    // Créer le nouveau message de contact
    const contactMessage = new Contact({
      name,
      email,
      company,
      phone,
      subject,
      message,
      inquiryType
    });

    await contactMessage.save();

    // Envoyer un email de confirmation au client
    try {
      await emailService.sendContactConfirmation(email, name, subject);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      // Ne pas faire échouer la requête si l'email échoue
    }

    // Envoyer une notification à l'équipe VitalCheck
    try {
      await emailService.sendContactNotification({
        name,
        email,
        company,
        phone,
        subject,
        message,
        inquiryType
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de la notification à l\'équipe:', emailError);
      // Ne pas faire échouer la requête si l'email échoue
    }

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject,
        inquiryType: contactMessage.inquiryType,
        createdAt: contactMessage.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création du message de contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// GET /api/contact - Récupérer tous les messages de contact (admin uniquement)
router.get('/', async (req, res) => {
  try {
    // Note: Dans une vraie application, vous devriez vérifier l'authentification admin ici
    const { page = 1, limit = 10, status, inquiryType } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (inquiryType) filter.inquiryType = inquiryType;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalContacts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des messages de contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// GET /api/contact/:id - Récupérer un message de contact spécifique (admin uniquement)
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message de contact non trouvé'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du message de contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// PUT /api/contact/:id - Mettre à jour le statut d'un message (admin uniquement)
router.put('/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message de contact non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Message de contact mis à jour avec succès',
      data: contact
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du message de contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// DELETE /api/contact/:id - Supprimer un message de contact (admin uniquement)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message de contact non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Message de contact supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du message de contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

module.exports = router;
