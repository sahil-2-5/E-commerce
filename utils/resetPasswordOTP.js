const nodemailer = require("nodemailer");

const resetPasswordOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Verification Code",
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background-color: #f8f9fa; color: #2c2c2c; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #d32f2f; margin-bottom: 16px;">Password Reset Request</h2>
            <div style="height: 3px; background: linear-gradient(90deg, #d32f2f, #f44336); width: 80px; margin: 0 auto;"></div>
        </div>

        <p style="margin: 0 0 16px 0; line-height: 1.5;">We received a request to reset the password for your Saree.com account. Please use the following verification code to proceed:</p>

        <div style="background-color: #fff; border: 1px dashed #d32f2f; border-radius: 6px; padding: 16px; text-align: center; margin: 24px 0;">
            <p style="font-size: 14px; color: #555; margin: 0 0 8px 0;">Your verification code:</p>
            <p style="font-size: 36px; font-weight: bold; color: #d32f2f; letter-spacing: 3px; margin: 0;">${otp}</p>
        </div>

        <p style="font-size: 14px; color: #555; margin: 0 0 20px 0; line-height: 1.5;">
            <strong>This code will expire in 10 minutes.</strong> If you didn't request this password reset, please ignore this email or contact our support team immediately.
        </p>

        <div style="background-color: #fff8f8; border-left: 4px solid #d32f2f; padding: 12px; margin: 20px 0;">
            <p style="font-size: 13px; color: #d32f2f; margin: 0;">
            <strong>Security tip:</strong> Never share this code with anyone. Saree.com will never ask you for your verification code.
            </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">

        <p style="font-size: 12px; color: #777; margin: 0; line-height: 1.5;">
            If you're having trouble with the button above, copy and paste the verification code into the password reset form on Saree.com.
        </p>
        </div>
  `,
  });
};

module.exports = resetPasswordOTP;
