const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNo, branch, semester } = req.body;

    // If ALLOWED_REGISTRATION_EMAIL is set, only allow that exact email to register
    const allowedEmail = process.env.ALLOWED_REGISTRATION_EMAIL || '';
    if (allowedEmail && email !== allowedEmail) {
      return res.status(403).json({ message: 'Registration is restricted for this application' });
    }

    // Determine role from email if FACULTY_DOMAIN is configured
    const facultyDomain = process.env.FACULTY_DOMAIN || '';
    let effectiveRole = role;
    if (facultyDomain) {
      if (email.toLowerCase().endsWith(facultyDomain.toLowerCase())) {
        effectiveRole = 'faculty';
      } else {
        effectiveRole = 'student';
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User using the effective role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: effectiveRole,
    });

    // If role is student, create student profile
    if (effectiveRole === "student") {
      await Student.create({
        user: user._id,
        rollNo,
        branch,
        semester,
      });
    }

    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // Recompute role from email domain if configured so login derives role from email
    const facultyDomain = process.env.FACULTY_DOMAIN || '';
    let loginRole = user.role;
    if (facultyDomain) {
      loginRole = email.toLowerCase().endsWith(facultyDomain.toLowerCase()) ? 'faculty' : 'student';
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: loginRole,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    let studentProfile = null;
    let studentId = null;

    if (loginRole === "student") {
      studentProfile = await Student.findOne({ user: user._id });
      studentId = studentProfile?._id || null;
    }

    res.status(200).json({
      message: "Login Successful",
      token,
      role: loginRole,
      user,
      studentId,
      studentProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};