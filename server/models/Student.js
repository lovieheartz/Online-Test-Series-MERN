  const mongoose = require("mongoose");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");

  const StudentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+\d{10,15}$/, 'Please enter a valid phone number with country code'],
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
      default: "student"
    },
    enrolledTests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestSeries",
      },
    ],
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    resetToken: String,
    resetTokenExpiry: Date,
  }, {
    timestamps: true,
  });

  // 🔐 Hash password before saving
  StudentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });

  // 🔁 Compare password method
  StudentSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  // 🔑 Generate JWT token method
  StudentSchema.methods.generateToken = function () {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  };

  const Student = mongoose.model("Student", StudentSchema);
  module.exports = Student;
