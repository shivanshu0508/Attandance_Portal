const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getStudentAttendance,
} = require("../controllers/attendanceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Faculty marks attendance
router.post(
  "/",
  protect,
  authorize("faculty"),
  markAttendance
);

// Faculty views all attendance
router.get(
  "/",
  protect,
  authorize("faculty"),
  getAttendance
);

// Student views own attendance
router.get(
  "/:studentId",
  protect,
  getStudentAttendance
);

module.exports = router;