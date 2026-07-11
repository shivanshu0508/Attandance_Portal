const Student = require("../models/Student");

// Get All Students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("user");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("user");

    if (!student) {
      return res.status(404).json({
        message: "Student Not Found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};