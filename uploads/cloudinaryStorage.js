const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
    {
      width: 400,
      height: 600,
      crop: 'fill',        // Ensures the image fills the dimensions
      gravity: 'auto',     // Auto-detects the main subject (face/body)
      quality: 'auto',     // Automatically adjusts image quality
      fetch_format: 'auto' // Optimizes image format (webp, etc.)
    }
  ],
  },
});

module.exports = storage;