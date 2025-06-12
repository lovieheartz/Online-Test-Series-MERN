const bcrypt = require("bcryptjs");
const Faculty = require("../models/Faculty");

// CREATE FACULTY
exports.createFaculty = async (req, res) => {
  const { name, email, password, phone, specialization } = req.body;

  if (!name || !email || !password || !phone || !specialization) {
    return res.status(400).json({ 
      success: false,
      message: "All fields are required." 
    });
  }

  try {
    const duplicate = await Faculty.findOne({ email });
    if (duplicate) {
      return res.status(409).json({ 
        success: false,
        message: "Faculty email already exists." 
      });
    }

    // ❌ Remove manual password hashing
    // ✅ Just pass the plain password; model will hash it automatically
    const newFaculty = new Faculty({
      name,
      email,
      phone,
      specialization,
      password,
      role: "faculty",
    });

    await newFaculty.save();

    res.status(201).json({ 
      success: true,
      message: "Faculty created successfully",
      data: {
        id: newFaculty._id,
        name: newFaculty.name,
        email: newFaculty.email,
        specialization: newFaculty.specialization
      }
    });
  } catch (err) {
    console.error("Create faculty error:", err);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: err.message 
    });
  }
};


// GET ALL FACULTIES
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find({}, 'name email specialization phone createdAt').sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true,
      count: faculties.length,
      data: faculties 
    });
  } catch (err) {
    console.error("Get all faculties error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch faculty data",
      error: err.message 
    });
  }
};

// DELETE FACULTY
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({ 
        success: false,
        message: "Faculty not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Faculty deleted successfully",
      data: {
        id: faculty._id,
        name: faculty.name
      }
    });
  } catch (err) {
    console.error("Delete faculty error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete faculty",
      error: err.message 
    });
  }
};