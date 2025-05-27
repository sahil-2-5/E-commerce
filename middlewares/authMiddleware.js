// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); 
// const asyncHandler = require('express-async-handler');

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   // Token is expected in Authorization header as: Bearer <token>
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       token = req.headers.authorization.split(' ')[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select('-password');
      
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token provided' });
//   }
// });

// module.exports = { protect };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-otp -otpExpires');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

