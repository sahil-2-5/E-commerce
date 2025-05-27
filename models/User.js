const mongoose = require('mongoose');
const addressSchema = require('./Address');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  addresses: [addressSchema], // Embedded address schema
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);