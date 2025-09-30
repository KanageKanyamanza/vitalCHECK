const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { uploadImages, uploadSingleImage, uploadToCloudinary, uploadMultipleToCloudinary, deleteImage } = require('../config/cloudinary');
const router = express.Router();

// Middleware d'authentification admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token d\'accès requis' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id || decoded.adminId).select('-password');
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Token invalide' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

// POST /upload/images - Upload multiple d'images
router.post('/images', authenticateAdmin, (req, res) => {
  uploadImages(req, res, async (err) => {
    if (err) {
      console.error('Erreur upload multer:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Erreur lors de l\'upload des images'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    try {
      // Uploader les images vers Cloudinary
      const filePaths = req.files.map(file => file.path);
      const cloudinaryResults = await uploadMultipleToCloudinary(filePaths);

      // Formater la réponse
      const uploadedImages = cloudinaryResults.map((result, index) => ({
        id: result.public_id,
        url: result.secure_url,
        originalName: req.files[index].originalname,
        size: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height
      }));

      res.json({
        success: true,
        message: `${uploadedImages.length} image(s) uploadée(s) avec succès`,
        data: uploadedImages
      });

    } catch (error) {
      console.error('Erreur upload Cloudinary:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload vers Cloudinary'
      });
    }
  });
});

// POST /upload/image - Upload d'une seule image
router.post('/image', authenticateAdmin, (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      console.error('Erreur upload multer:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Erreur lors de l\'upload de l\'image'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    try {
      // Uploader l'image vers Cloudinary
      const cloudinaryResult = await uploadToCloudinary(req.file.path);

      // Formater la réponse
      const uploadedImage = {
        id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
        originalName: req.file.originalname,
        size: cloudinaryResult.bytes,
        format: cloudinaryResult.format,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height
      };

      res.json({
        success: true,
        message: 'Image uploadée avec succès',
        data: uploadedImage
      });

    } catch (error) {
      console.error('Erreur upload Cloudinary:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload vers Cloudinary'
      });
    }
  });
});

// DELETE /upload/image/:id - Supprimer une image
router.delete('/image/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de l\'image requis'
      });
    }

    const result = await deleteImage(id);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image supprimée avec succès'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }

  } catch (error) {
    console.error('Erreur suppression image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'image'
    });
  }
});

// GET /upload/images - Lister les images du dossier vitalcheck-blog
router.get('/images', authenticateAdmin, async (req, res) => {
  try {
    const { cloudinary } = require('../config/cloudinary');
    
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'vitalcheck-blog/',
      max_results: 100
    });

    const images = result.resources.map(resource => ({
      id: resource.public_id,
      url: resource.secure_url,
      size: resource.bytes,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      createdAt: resource.created_at
    }));

    res.json({
      success: true,
      data: images
    });

  } catch (error) {
    console.error('Erreur récupération images:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des images'
    });
  }
});

module.exports = router;
