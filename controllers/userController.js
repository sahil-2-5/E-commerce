const User = require("../models/User");
const generateClientToken = require("../utils/generateClientToken");
const sendClientdOTP = require("../utils/sendClientOTP");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email });
  }
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  await user.save();

  await sendClientdOTP(email, otp);

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpires = null;
  await user.save();

  const token = generateClientToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    _id: user._id,
    email: user.email,
    token,
    success: true,
  });
};

exports.logoutUser = async (req, res) => {
  // Remove the token from the client side ( Frontend )
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully, session cookie cleared",
  });
};

