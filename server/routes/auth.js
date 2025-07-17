const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');

const { sendPasswordResetEmail } = require('../services/mailService');

// Helper to get model by role
const getModelByRole = (role) => {
  switch (role) {
    case 'admin': return Admin;
    case 'faculty': return Faculty;
    case 'student': return Student;
    default: return null;
  }
};

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
      if (user) {
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          const token = user.generateToken();
          return res.json({ token, role, name: user.name });
        } else {
          console.warn(`Password mismatch for ${role}: ${email}`);
        }
      }
    }

    return res.status(401).json({ message: 'Invalid email or password.' });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  const { token, currentPassword, password, type } = req.body;

  if (!token || !password || !type) {
    return res.status(400).json({ message: 'Token, password, and user type are required.' });
  }

  const UserModel = getModelByRole(type);
  if (!UserModel) {
    return res.status(400).json({ message: 'Invalid user type.' });
  }

  try {
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    
    // For password reset via token, we don't need to validate the current password
    // This is because the user has already verified their identity via the reset token
    // which was sent to their email

    user.password = password; // Will be hashed via Mongoose middleware
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error.message);
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

    await sendPasswordResetEmail(email, resetToken, userType);

    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ message: 'Error processing your request' });
  }
});

module.exports = router;
