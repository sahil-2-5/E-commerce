const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateClientToken = require("../utils/generateClientToken");
const clientSignupOTP = require("../utils/clientSignupOTP");
const resetPasswordOTP = require("../utils/resetPasswordOTP");

// exports.sendOtp = async (req, res) => {
//   const { email } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   let user = await User.findOne({ email });
//   if (!user) {
//     user = await User.create({ email });
//   }
//   user.otp = otp;
//   user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
//   await user.save();

//   await clientSignupOTP(email, otp);

//   res.status(200).json({
//     success: true,
//     message: "OTP sent to your email",
//   });
// };

// exports.verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   const user = await User.findOne({ email });

//   if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
//     return res.status(400).json({ message: "Invalid or expired OTP" });
//   }

//   user.otp = null;
//   user.otpExpires = null;
//   await user.save();

//   const token = generateClientToken(user._id);

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "development",
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });

//   res.status(200).json({
//     _id: user._id,
//     email: user.email,
//     token,
//     success: true,
//   });
// };

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    await user.save();

    // sendClientOTP should handle nodemailer internally
    await clientSignupOTP(email, otp);

    res.status(200).json({ msg: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ msg: "Signup error", error: err.message });
  }
};

exports.verifySignupOtp = async (req, res) => {
   const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ msg: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Verification error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ msg: "Email not verified" });
    }

    const token = generateClientToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
      isVerified: user.isVerified,
      msg: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ msg: "Login error", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await resetPasswordOTP(email, otp);

    res.status(200).json({ msg: "Reset OTP sent to email" });
  } catch (err) {
    res.status(500).json({ msg: "Error sending OTP", error: err.message });
  }
}

exports.verifyResetOtp = async (req, res) => {
   const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    await user.save();

    res.status(200).json({ msg: "OTP verified. You can now reset your password." });
  } catch (err) {
    res.status(500).json({ msg: "OTP verification failed", error: err.message });
  }
}

exports.resetPassword = async (req, res) => {
   const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: "Error resetting password", error: err.message });
  }
}

exports.logoutUser = async (req, res) => {
  // Remove the token from the client side ( Frontend )
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully, session cookie cleared",
  });
};
