// services/mailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error('SMTP transporter failed:', err.message);
  } else {
    console.log('SMTP transporter is ready');
  }
});

const sendPasswordResetEmail = async (email, resetToken, userType) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&type=${userType.toLowerCase()}`;

  const mailOptions = {
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset for your ${userType} account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
};
