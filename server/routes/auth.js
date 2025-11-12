const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const router = express.Router();

// Register/Start Assessment
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('companyName').trim().isLength({ min: 2 }),
  body('sector').trim().isLength({ min: 2 }),
  body('companySize').isIn(['micro', 'sme', 'large-sme']),
  body('phone').optional().trim().isLength({ min: 6 }).withMessage('Phone number must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, companyName, sector, companySize, phone } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      let shouldSave = false;
      if (phone && phone !== user.phone) {
        user.phone = phone;
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }

      // User exists, return user info
      return res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          companyName: user.companyName,
          sector: user.sector,
          companySize: user.companySize,
          phone: user.phone,
          hasCompletedAssessment: user.assessments.length > 0
        }
      });
    }

    // Create new user
    user = new User({
      email,
      companyName,
      sector,
      companySize,
      phone
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        sector: user.sector,
        companySize: user.companySize,
        phone: user.phone,
        hasCompletedAssessment: false
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Get user by email
router.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        sector: user.sector,
        companySize: user.companySize,
        phone: user.phone,
        hasCompletedAssessment: user.assessments.length > 0
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
