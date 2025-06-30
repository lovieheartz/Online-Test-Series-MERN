require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // ✅ add this

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // <== add this line

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/", require("./routes/auth"));
app.use("/student", require("./routes/studentRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/faculty", require("./routes/facultyRoutes"));

// Test route (optional)
app.get("/", (req, res) => {
  res.send("Server is up and running");
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
