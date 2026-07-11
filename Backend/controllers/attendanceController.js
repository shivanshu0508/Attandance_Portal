const Attendance = require("../models/Attendance");

// Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { student, date, status } = req.body;

    const selectedDate = new Date(date);
    const today = new Date();
    const normalizedSelected = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (normalizedSelected > normalizedToday) {
      return res.status(400).json({
        message: "Attendance cannot be marked for future dates",
      });
    }

    // Check if attendance already exists
    const exists = await Attendance.findOne({
      student,
      date,
    });

    if (exists) {
      return res.status(400).json({
        message: "Attendance Already Marked",
      });
    }

    const attendance = await Attendance.create({
      student,
      date,
      status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Attendance
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate({
        path: "student",
        populate: {
          path: "user",
        },
      });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Attendance of One Student
exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      student: req.params.studentId,
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};