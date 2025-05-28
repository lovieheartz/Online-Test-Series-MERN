require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/", require("./routes/authRoutes")); 
// app.use("/auth", require("./routes/authRoutes"));
app.use("/student", require("./routes/studentRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use('/faculty', require('./routes/facultyRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
