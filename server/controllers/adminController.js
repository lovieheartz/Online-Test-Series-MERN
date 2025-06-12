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

    // ❌ Remove manual hashing
    const newAdmin = new Admin({ name, email, phone, password, role: 'admin' });

    await newAdmin.save();
    res.status(201).json({ message: "Admin user created successfully", user: newAdmin });
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
    if (duplicate) return res.status(400).json({ message: "Admin email already exists" });

    // ❌ Remove manual hashing
    const newAdmin = new Admin({ name, email, phone, password, role: 'admin' });

    await newAdmin.save();
    res.status(201).json({ message: "Admin user created successfully", user: newAdmin });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
