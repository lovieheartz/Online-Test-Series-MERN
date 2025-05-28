const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+\d{10,15}$/, 'Please enter a valid phone number with country code'],
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String, // URL or file path to the profile picture
    default: "",
  },
  role: {
    type: String,
    default: "faculty",
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model("Faculty", facultySchema);
