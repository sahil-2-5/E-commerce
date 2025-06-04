const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { v4: uuidv4 } = require('uuid');

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uniqueId = uuidv4();

    const stream = cloudinary.uploader.upload_stream({
      folder,
      public_id: uniqueId,
      transformation: [
        { width: 400, height: 600, crop: 'fill', gravity: 'auto', quality: 'auto', fetch_format: 'auto' }
      ]
    }, (error, result) => {
      if (error) return reject(error);
      resolve({ id: uniqueId, url: result.secure_url });
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
