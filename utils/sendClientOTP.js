const nodemailer = require("nodemailer");

const sendClientdOTP = async (email, otp) => {
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
    subject: "Your OTP Code",
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background-color: #ffffff; color: #2c2c2c; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
          <h2 style="color: #012fff; margin-bottom: 20px;">Your Login OTP</h2>

          <p style="margin: 0 0 12px 0;">A login attempt was made using your email address on Saree.com.</p>

          <p style="font-size: 16px; margin: 0 0 8px 0;">Use the following one-time password (OTP) to continue:</p>

          <p style="font-size: 32px; font-weight: bold; color: #012fff; letter-spacing: 2px; margin: 16px 0;">${otp}</p>

          <p style="font-size: 14px; color: #555; margin: 0 0 20px 0;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

          <p style="font-size: 13px; color: #777; margin: 0;">
            If you did not initiate this request, you can safely ignore this email.
          </p>
        </div>
        `,
  });
};

module.exports = sendClientdOTP;
