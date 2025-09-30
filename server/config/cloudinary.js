const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration multer pour stockage temporaire
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/temp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuration multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 10 // Maximum 10 fichiers par requête
  },
  fileFilter: (req, file, cb) => {
    // Vérifier le type de fichier
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  }
});

// Middleware pour upload multiple d'images
const uploadImages = upload.array('images', 10);

// Middleware pour upload d'une seule image
const uploadSingleImage = upload.single('image');

// Fonction pour uploader une image vers Cloudinary
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'vitalcheck-blog',
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    };

    const result = await cloudinary.uploader.upload(filePath, {
      ...defaultOptions,
      ...options
    });

    // Supprimer le fichier temporaire
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    // Supprimer le fichier temporaire en cas d'erreur
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

// Fonction pour uploader plusieurs images vers Cloudinary
const uploadMultipleToCloudinary = async (filePaths, options = {}) => {
  try {
    const results = await Promise.all(
      filePaths.map(filePath => uploadToCloudinary(filePath, options))
    );
    return results;
  } catch (error) {
    // Nettoyer les fichiers temporaires en cas d'erreur
    filePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    throw error;
  }
};

// Fonction utilitaire pour supprimer une image de Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    throw error;
  }
};

// Fonction utilitaire pour supprimer plusieurs images
const deleteImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Erreur lors de la suppression des images:', error);
    throw error;
  }
};

// Fonction pour obtenir l'URL optimisée d'une image
const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 800,
    height: 600,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto'
  };
  
  return cloudinary.url(publicId, { ...defaultOptions, ...options });
};

module.exports = {
  cloudinary,
  uploadImages,
  uploadSingleImage,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteImage,
  deleteImages,
  getOptimizedImageUrl
};
