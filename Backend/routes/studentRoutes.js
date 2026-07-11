const express = require("express");
const router = express.Router();

const {
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Get all students
router.get(
  "/",
  protect,
  authorize("faculty"),
  getStudents
);

// Get single student
router.get(
  "/:id",
  protect,
  getStudent
);

// Update student
router.put(
  "/:id",
  protect,
  authorize("faculty"),
  updateStudent
);

// Delete student
router.delete(
  "/:id",
  protect,
  authorize("faculty"),
  deleteStudent
);

module.exports = router;