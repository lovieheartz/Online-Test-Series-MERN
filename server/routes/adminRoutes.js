const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload_multer");
const { authenticateToken } = require("../middleware/auth");

const {
  checkAdminExists,
  createFirstAdmin,
  createAdminByAdmin,
  getAdminProfile,
  updateAdminProfile,
  uploadAdminAvatar,
  deleteAdmin,
} = require("../controllers/adminController");

// Check if any admin exists
router.get("/exists", checkAdminExists);

// Create the first admin (without authentication)
router.post("/create-first-admin", createFirstAdmin);

// Create admin by another admin
router.post("/create-admin", createAdminByAdmin);

// Get current admin profile
router.get("/profile", authenticateToken, getAdminProfile);

// Update current admin profile
router.put("/profile", authenticateToken, updateAdminProfile);

// Upload avatar
router.post(
  "/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  uploadAdminAvatar
);

// Delete admin by ID (if needed)
router.delete("/:id", authenticateToken, deleteAdmin);

module.exports = router;
