const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const Employee = require("./models/Employee");

const app = express();

// EJS
app.set("view engine", "ejs");

// Read form data
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: "erp-secret-key",
    resave: false,
    saveUninitialized: false,

    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  }),
);

// MongoDB Local Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/ERP")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// ======================================
// ADMIN LOGIN
// ======================================

app.get("/", (req, res) => {
  res.render("login", {
    error: null,
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Simple admin login

  if (username === "admin" && password === "admin123") {
    req.session.admin = username;

    res.redirect("/dashboard");
  } else {
    res.render("login", {
      error: "Invalid username or password",
    });
  }
});

// ======================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ======================================

function isAdmin(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/");
  }
}

// ======================================
// DASHBOARD - READ
// ======================================

app.get("/dashboard", isAdmin, async (req, res) => {
  try {
    const employees = await Employee.find();

    res.render("dashboard", {
      employees: employees,
    });
  } catch (error) {
    console.log(error);

    res.send("Error while fetching employees");
  }
});

// ======================================
// ADD EMPLOYEE PAGE
// ======================================

app.get("/employee/add", isAdmin, (req, res) => {
  res.render("add-employee");
});

// ======================================
// ADD EMPLOYEE - CREATE
// ======================================

app.post("/employee/add", isAdmin, async (req, res) => {
  try {
    const { name, email, department, basicSalary } = req.body;

    // Generate Employee ID

    const count = await Employee.countDocuments();

    const empid = "EMP" + String(count + 1).padStart(3, "0");

    // Generate random password

    const generatedPassword = Math.random().toString(36).slice(-8);

    // Salary calculation

    const basic = Number(basicSalary);

    const hra = basic * 0.2;

    const da = basic * 0.1;

    const pf = basic * 0.12;

    const netSalary = basic + hra + da - pf;

    // Hash password

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create employee

    const employee = new Employee({
      empid: empid,

      name: name,

      email: email,

      department: department,

      basicSalary: basic,

      hra: hra,

      da: da,

      pf: pf,

      netSalary: netSalary,

      password: hashedPassword,
    });

    // Save employee

    await employee.save();

    // Send email

    await sendEmployeeEmail(email, name, empid, generatedPassword);

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);

    res.send("Error while adding employee");
  }
});

// ======================================
// EDIT EMPLOYEE PAGE
// ======================================

app.get("/employee/edit/:id", isAdmin, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    res.render("edit-employee", {
      employee: employee,
    });
  } catch (error) {
    console.log(error);

    res.send("Employee not found");
  }
});

// ======================================
// UPDATE EMPLOYEE
// ======================================

app.post("/employee/update/:id", isAdmin, async (req, res) => {
  try {
    const { name, email, department, basicSalary } = req.body;

    // Salary calculation

    const basic = Number(basicSalary);

    const hra = basic * 0.2;

    const da = basic * 0.1;

    const pf = basic * 0.12;

    const netSalary = basic + hra + da - pf;

    await Employee.findByIdAndUpdate(
      req.params.id,

      {
        name: name,
        email: email,
        department: department,

        basicSalary: basic,

        hra: hra,

        da: da,

        pf: pf,

        netSalary: netSalary,
      },
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);

    res.send("Error while updating employee");
  }
});

// ======================================
// DELETE EMPLOYEE
// ======================================

app.get("/employee/delete/:id", isAdmin, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);

    res.send("Error while deleting employee");
  }
});

// ======================================
// SEND EMAIL
// ======================================

async function sendEmployeeEmail(email, name, empid, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "teamsuitehrms@gmail.com",

      pass: "daiv wggu pkpi cobd",
    },
  });

  await transporter.sendMail({
    from: "teamsuitehrms@gmail.com",

    to: email,

    subject: "ERP Employee Account",

    text: `Hello ${name},

Your employee account has been created.

Employee ID: ${empid}

Password: ${password}

Please keep these details safe.

Regards,
ERP Admin`,
  });
}

// ======================================
// LOGOUT
// ======================================

app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.send("Error while logging out");
    }

    res.redirect("/");
  });
});

// ======================================
// START SERVER
// ======================================

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
