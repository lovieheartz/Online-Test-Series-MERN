// services/mailService.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

const sendFacultyWelcomeEmail = async (faculty, password) => {
  // Generate reset token for the faculty
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour
  
  // Update faculty with reset token
  faculty.resetToken = resetToken;
  faculty.resetTokenExpiry = resetTokenExpiry;
  await faculty.save();
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&type=faculty`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: faculty.email,
    subject: 'Welcome to Online Test Series - Faculty Account Created',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background-color: #4285f4;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 5px 5px 0 0;
          margin: -20px -20px 20px;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          text-align: center;
          color: #666;
        }
        .btn {
          display: inline-block;
          background-color: #4285f4;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 15px 0;
        }
        .credentials {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 4px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to Online Test Series!</h2>
        </div>
        
        <p>Dear <strong>${faculty.name}</strong>,</p>
        
        <p>Welcome to our team! Your faculty account has been successfully created in our Online Test Series platform.</p>
        
        <p>Here are your account credentials:</p>
        
        <div class="credentials">
          <p><strong>Email:</strong> ${faculty.email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
        </div>
        
        <p>For security reasons, we recommend changing your password immediately after your first login.</p>
        
        <p>You can reset your password by clicking the button below:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="btn">Reset Password</a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
        
        <p>This link will expire in 1 hour for security reasons.</p>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br>Online Test Series Team</p>
        
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
  sendFacultyWelcomeEmail,
};
