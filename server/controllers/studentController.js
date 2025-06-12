const bcrypt = require("bcryptjs");
const Student = require("../models/Student");

exports.registerStudent = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Student with this email already exists." });
    }

    // ❌ Don't hash manually
    const newStudent = new Student({ name, email, phone, password, role: 'student' });

    await newStudent.save(); // ✅ Password will be hashed here

    res.status(201).json({
      message: "Student registered successfully",
      user: { id: newStudent._id, name, email, phone, role: 'student' }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error. Registration failed." });
  }
};

