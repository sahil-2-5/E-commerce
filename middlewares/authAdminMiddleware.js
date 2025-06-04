const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.AuthAdminId = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-otp -otpExpires');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}