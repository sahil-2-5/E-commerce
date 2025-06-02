const multer = require('multer');
const {storage} = require('../uploads/cloudinaryStorage');

const upload = multer({ storage });

module.exports = upload;