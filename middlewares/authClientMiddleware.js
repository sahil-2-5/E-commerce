const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.AuthClientId = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_CLIENT_SECRET);
    req.user = await User.findById(decoded.id).select('-otp -otpExpires');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

