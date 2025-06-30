const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// ✅ Check if any admin exists
exports.checkAdminExists = async (req, res) => {
  try {
    const adminExists = await Admin.exists({});
    res.json({ exists: !!adminExists });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create the very first admin
exports.createFirstAdmin = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    const emailUsed = await Admin.findOne({ email });
    if (emailUsed) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newAdmin = new Admin({ name, email, phone, password, role: "admin" });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create admin by another admin (after verifying credentials)
exports.createAdminByAdmin = async (req, res) => {
  const { name, email, phone, password, existingAdminEmail, existingAdminPassword } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email: existingAdminEmail });

    if (!existingAdmin || !(await bcrypt.compare(existingAdminPassword, existingAdmin.password))) {
      return res.status(401).json({ message: "Invalid existing admin credentials" });
    }

    const duplicate = await Admin.findOne({ email });
    if (duplicate) {
      return res.status(400).json({ message: "Admin email already exists" });
    }

    const newAdmin = new Admin({ name, email, phone, password, role: "admin" });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get current admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    console.error("Get admin profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update current admin profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, email, phone } = req.body;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;

    const updatedAdmin = await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedAdmin,
    });
  } catch (err) {
    console.error("Update admin profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Upload admin avatar
exports.uploadAdminAvatar = async (req, res) => {
  try {
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Save relative path to the avatar field
    admin.avatar = `/uploads/Avatar_Admin/${req.file.filename}`;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: { avatar: admin.avatar },
    });
  } catch (err) {
    console.error("Upload admin avatar error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin deleted successfully",
      data: { id: admin._id, name: admin.name },
    });
  } catch (err) {
    console.error("Delete admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
