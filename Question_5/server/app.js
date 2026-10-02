const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const Employee = require("./models/Employee");
const Leave = require("./models/Leave");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB error:", error);
  });

// ========================================
// EMPLOYEE LOGIN
// ========================================

app.post("/api/login", async (req, res) => {
  try {
    const { empid, password } = req.body;

    // Find employee
    const employee = await Employee.findOne({
      empid: empid,
    });

    if (!employee) {
      return res.status(401).json({
        message: "Invalid Employee ID or Password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Employee ID or Password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        empid: employee.empid,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h",
      },
    );

    res.json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ========================================
// JWT MIDDLEWARE
// ========================================

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.empid = decoded.empid;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// ========================================
// PAGE 1 - EMPLOYEE PROFILE
// ========================================

app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      empid: req.empid,
    }).select("-password");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employee);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ========================================
// PAGE 2 - ADD LEAVE
// ========================================

app.post("/api/leave", verifyToken, async (req, res) => {
  try {
    const { date, reason, grant } = req.body;

    const leave = new Leave({
      empid: req.empid,

      date: date,

      reason: reason,

      grant: grant,
    });

    await leave.save();

    res.json({
      message: "Leave application added",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error adding leave",
    });
  }
});

// ========================================
// PAGE 2 - LIST LEAVES
// ========================================

app.get("/api/leaves", verifyToken, async (req, res) => {
  try {
    const leaves = await Leave.find({
      empid: req.empid,
    });

    res.json(leaves);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching leaves",
    });
  }
});

// ========================================
// SERVER
// ========================================

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
