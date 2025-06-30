const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const path = require("path");

// ✅ Register student (no manual hashing)
exports.registerStudent = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Student with this email already exists." });
    }

    const newStudent = new Student({
      name,
      email,
      password, // password hashed by pre-save hook
      phone,
      role: "student",
    });

    await newStudent.save();

    res.status(201).json({
      message: "Student registered successfully.",
      user: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        role: newStudent.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error. Registration failed." });
  }
};

// ✅ Get logged-in student's profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ data: student });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update logged-in student's profile
exports.updateProfile = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;

    await student.save();

    res.json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Upload student avatar
exports.uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Save the relative path
    student.avatar = `/uploads/Avatar_Student/${req.file.filename}`;
    await student.save();

    res.json({ message: "Avatar uploaded successfully.", avatar: student.avatar });
  } catch (err) {
    console.error("Upload avatar error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
