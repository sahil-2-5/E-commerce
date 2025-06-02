const nodemailer = require("nodemailer");

const sendAdminOTP = async (email, otp) => {
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
    subject: "Your Admin OTP Code",
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background-color: #ffffff; color: #2c2c2c; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
            <h2 style="color: #d62828; margin-bottom: 20px;">Admin Access OTP</h2>

            <p style="margin: 0 0 12px 0;">
            A login attempt was made using your <strong>Admin email address</strong> on <strong>Saree.com Admin Portal</strong>.
            </p>

            <p style="font-size: 16px; margin: 0 0 8px 0;">
            Use the following One-Time Password (OTP) to proceed with admin login:
            </p>

            <p style="font-size: 36px; font-weight: bold; color: #d62828; letter-spacing: 2px; margin: 20px 0;">
            ${otp}
            </p>

            <p style="font-size: 14px; color: #555; margin: 0 0 20px 0;">
            This OTP is valid for <strong>5 minutes</strong>. Do <strong>not share</strong> it with anyone for security reasons.
            </p>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

            <p style="font-size: 13px; color: #777; margin: 0;">
            If you did not request this login, please ignore this email or contact support immediately.
            </p>
        </div>
    `,
  });
};

module.exports = sendAdminOTP;
