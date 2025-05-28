const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
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
  },
  testSeriesCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSeries",
    },
  ],
  reportsGenerated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
}, {
  timestamps: true,
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
