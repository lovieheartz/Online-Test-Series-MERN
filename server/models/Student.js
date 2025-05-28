const mongoose = require("mongoose");

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
    type: String, // URL or file path to the profile picture
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
}, {
  timestamps: true, // handles createdAt and updatedAt automatically
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
