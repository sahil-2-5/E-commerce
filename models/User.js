const mongoose = require('mongoose');
const addressSchema = require('./Address');

const userSchema = new mongoose.Schema({
  firstName : {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false, // Indicates if the user has verified their email
  },
  addresses: [addressSchema], // Embedded address schema
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);