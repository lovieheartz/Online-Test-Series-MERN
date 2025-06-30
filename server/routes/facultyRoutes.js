const express = require("express");
const router = express.Router();

const {
  createFaculty,
  getAllFaculties,
  getFacultyProfile,
  updateFacultyProfile,
  updateAvatar, // ✅ Import avatar upload controller
} = require("../controllers/facultyController");

const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload_multer"); // ✅ Import multer middleware

// Create a faculty
router.post("/create-faculty", createFaculty);

// Get all faculties
router.get("/all-faculties", getAllFaculties);

// Get current faculty profile
router.get("/profile", authenticateToken, getFacultyProfile);

// Update current faculty profile fields (name, email, etc.)
router.put("/profile", authenticateToken, updateFacultyProfile);

// ✅ Upload avatar
router.post(
  "/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  updateAvatar
);

module.exports = router;
