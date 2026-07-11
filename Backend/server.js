const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Connect Database
const connectDB = require("./config/db");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Attendance Management Portal API is Running 🚀",
  });
});

// Handle Invalid Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});