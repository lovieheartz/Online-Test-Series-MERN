const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const userTypes = [
    { model: Admin, role: 'admin' },
    { model: Faculty, role: 'faculty' },
    { model: Student, role: 'student' },
  ];

  try {
    for (const { model, role } of userTypes) {
      const user = await model.findOne({ email });
      if (user && await user.comparePassword(password)) {
        // Assume comparePassword is a method on your schema that compares hashed passwords
        const token = user.generateToken(); // Custom method or use jwt.sign()
        return res.json({ token, role, name: user.name });
      }
    }

    return res.status(401).json({ message: 'Invalid email or password.' });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  const { token, password, type } = req.body;

  if (!token || !password || !type) {
    return res.status(400).json({ message: 'Token, password, and user type are required.' });
  }

  let UserModel;
  if (type === 'admin') UserModel = Admin;
  else if (type === 'faculty') UserModel = Faculty;
  else if (type === 'student') UserModel = Student;
  else return res.status(400).json({ message: 'Invalid user type.' });

  try {
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    user.password = password; // Password should be hashed via Mongoose middleware
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    let user = null;
    let userType = null;

    user = await Admin.findOne({ email });
    if (user) userType = 'Admin';

    if (!user) {
      user = await Faculty.findOne({ email });
      if (user) userType = 'Faculty';
    }

    if (!user) {
      user = await Student.findOne({ email });
      if (user) userType = 'Student';
    }

    if (!user) {
      return res.status(404).json({ message: 'If this email exists, we will send a reset link' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    transporter.verify((err, success) => {
      if (err) {
        console.error('❌ SMTP transporter failed:', err.message);
      } else {
        console.log('✅ SMTP transporter is ready');
      }
    });

    // ✅ Use FRONTEND_URL from .env
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&type=${userType.toLowerCase()}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset for your ${userType} account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('❌ Error processing request:', error.message);
    res.status(500).json({ message: 'Error processing your request' });
  }
});

module.exports = router;
