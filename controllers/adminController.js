const Admin = require("../models/Admin");
const generateAdminToken = require("../utils/generateAdminToken");
const sendAdminOTP = require("../utils/sendAdminOTP");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let admin = await Admin.findOne({ email });
  if (!admin) {
    admin = await Admin.create({ email });
  }
  admin.otp = otp;
  admin.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  await admin.save();

  await sendAdminOTP(email, otp);
  
  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin || admin.otp !== otp || Date.now() > admin.otpExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  admin.otp = null;
  admin.otpExpires = null;
  await admin.save();

  const token = generateAdminToken(admin._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    _id: admin._id,
    email: admin.email,
    token,
    success: true,
  });
};

exports.logoutAdmin = async (req, res) => {
  // Remove the token from the client side (Frontend)
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully, session cookie cleared",
  });
};