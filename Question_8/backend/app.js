const express = require("express");
const cors = require("cors");

const { Student, db } = require("./models/Student");

const app = express();

// Middleware

app.use(cors());

app.use(express.json());

// =====================================
// CREATE STUDENT
// =====================================

app.post("/api/students", async (req, res) => {
  try {
    const student = await Student.create({
      name: req.body.name,

      email: req.body.email,

      age: req.body.age,

      course: req.body.course,
    });

    res.json({
      message: "Student added successfully",

      student: student,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error adding student",
    });
  }
});

// =====================================
// READ ALL STUDENTS
// =====================================

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.findAll();

    res.json(students);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching students",
    });
  }
});

// =====================================
// READ ONE STUDENT
// =====================================

app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching student",
    });
  }
});

// =====================================
// UPDATE STUDENT
// =====================================

app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await student.update({
      name: req.body.name,

      email: req.body.email,

      age: req.body.age,

      course: req.body.course,
    });

    res.json({
      message: "Student updated successfully",

      student: student,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error updating student",
    });
  }
});

// =====================================
// DELETE STUDENT
// =====================================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await student.destroy();

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error deleting student",
    });
  }
});

// =====================================
// CONNECT DATABASE AND START SERVER
// =====================================

db.sync()
  .then(() => {
    console.log("Database connected");

    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000");
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });
