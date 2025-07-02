const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
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

    // Remove the avatar file if it exists
    if (faculty.avatar) {
      const avatarPath = path.join(__dirname, "..", faculty.avatar);
      fs.unlink(avatarPath, (err) => {
        if (err) {
          console.error("Error deleting avatar during faculty deletion:", err.message);
        }
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

// GET CURRENT FACULTY PROFILE
exports.getFacultyProfile = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const faculty = await Faculty.findById(facultyId).select("-password");

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found"
      });
    }

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (err) {
    console.error("Get faculty profile error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: err.message
    });
  }
};

// UPDATE CURRENT FACULTY PROFILE
exports.updateFacultyProfile = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { name, email, phone, specialization } = req.body;

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found"
      });
    }

    if (name) faculty.name = name;
    if (email) faculty.email = email;
    if (phone) faculty.phone = phone;
    if (specialization) faculty.specialization = specialization;

    const updatedFaculty = await faculty.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedFaculty
    });
  } catch (err) {
    console.error("Update faculty profile error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message
    });
  }
};

// UPLOAD AVATAR (with deletion of old file)
exports.updateAvatar = async (req, res) => {
  try {
    const facultyId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded."
      });
    }

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found"
      });
    }

    // Delete previous avatar if it exists
    if (faculty.avatar) {
      const oldPath = path.join(__dirname, "..", faculty.avatar);
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error("Error deleting previous avatar:", err.message);
        }
      });
    }

    // Save new avatar path
    const avatarPath = `/uploads/Avatar_Faculty/${req.file.filename}`;
    faculty.avatar = avatarPath;
    await faculty.save();

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatarPath
    });
  } catch (err) {
    console.error("Upload avatar error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to upload avatar",
      error: err.message
    });
  }
};
