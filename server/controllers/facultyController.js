const bcrypt = require("bcryptjs");
const Faculty = require("../models/Faculty");

// CREATE FACULTY
exports.createFaculty = async (req, res) => {
  const { name, email, password, phone, specialization } = req.body;

  // Validate required fields
  if (!name || !email || !password || !phone || !specialization) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check for duplicate email
    const duplicate = await Faculty.findOne({ email });
    if (duplicate) {
      return res.status(400).json({ message: "Faculty email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Faculty
    const newFaculty = new Faculty({
      name,
      email,
      phone,
      specialization,
      password: hashedPassword,
      role: "faculty",
    });

    // Save to database
    await newFaculty.save();

    res.status(201).json({ message: "Faculty user created successfully", user: newFaculty });
  } catch (err) {
    console.error("Create faculty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL FACULTIES
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find({}, 'name email specialization'); // Only return necessary fields
    res.status(200).json(faculties);
  } catch (err) {
    console.error("Get all faculties error:", err);
    res.status(500).json({ message: "Failed to fetch faculty data." });
  }
};
