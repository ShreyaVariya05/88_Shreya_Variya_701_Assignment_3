const express = require("express");
const path = require("path");
const multer = require("multer");

const { body, validationResult } = require("express-validator");

const app = express();

// EJS setup
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));

// Make uploads folder accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------
// Multer configuration
// -------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG and PNG images are allowed."));
    }
  },
});

// -------------------------
// GET registration form
// -------------------------

app.get("/", (req, res) => {
  res.render("form", {
    errors: [],
    old: {},
  });
});

// -------------------------
// POST registration
// -------------------------

app.post(
  "/register",

  upload.fields([
    {
      name: "profilePic",
      maxCount: 1,
    },
    {
      name: "otherPics",
      maxCount: 5,
    },
  ]),

  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must contain at least 3 characters"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters"),

    body("confirmPassword")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage("Passwords do not match"),

    body("email").trim().isEmail().withMessage("Enter a valid email"),

    body("gender").notEmpty().withMessage("Please select gender"),

    body("hobbies").custom((value) => {
      if (!value) {
        throw new Error("Please select at least one hobby");
      }
      return true;
    }),
  ],

  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("form", {
        errors: errors.array(),
        old: req.body,
      });
    }

    // Store submitted data
    const user = {
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      hobbies: req.body.hobbies,
    };

    // Profile picture
    let profilePic = null;

    if (req.files && req.files.profilePic) {
      profilePic = req.files.profilePic[0].filename;
    }

    // Other pictures
    let otherPics = [];

    if (req.files && req.files.otherPics) {
      otherPics = req.files.otherPics.map((file) => file.filename);
    }

    res.render("result", {
      user: user,
      profilePic: profilePic,
      otherPics: otherPics,
    });
  },
);

// -------------------------
// File download route
// -------------------------

app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);

  res.download(filePath, req.params.filename, function (err) {
    if (err) {
      console.log(err);
    }
  });
});

// -------------------------
// Error handling
// -------------------------

app.use((err, req, res, next) => {
  console.log(err.message);

  res.render("form", {
    errors: [
      {
        msg: err.message,
      },
    ],
    old: req.body,
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
