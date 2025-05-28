const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Faculty = require("../models/Faculty");
const Student = require("../models/Student");

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const models = [
    { model: Admin, role: "admin" },
    { model: Faculty, role: "faculty" },
    { model: Student, role: "student" },
  ];

  for (let { model, role } of models) {
    const user = await model.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: "Incorrect password" });

      const token = jwt.sign({ id: user._id, email: user.email, role }, JWT_SECRET, {
        expiresIn: "1h"
      });

      return res.status(200).json({
        message: "Login successful",
        token,
        role,
        name: user.name,
        email: user.email
      });
    }
  }

  return res.status(404).json({ error: "No user found with this email" });
};

exports.me = (req, res) => {
  res.json(req.user);
};
