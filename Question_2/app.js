const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    store: new FileStore({
      path: path.join(__dirname, "sessions"),
    }),

    secret: "my-secret-key",

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: false,
      maxAge: 30 * 60 * 1000,
    },
  }),
);

// Login page
app.get("/", (req, res) => {
  res.render("login", {
    error: null,
  });
});

// Login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "admin" && password === "1234") {
    req.session.username = username;

    res.redirect("/home");
  } else {
    res.render("login", {
      error: "Invalid username or password",
    });
  }
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/");
  }
}

// Protected route 1
app.get("/home", isLoggedIn, (req, res) => {
  res.render("home", {
    username: req.session.username,
  });
});

// Protected route 2
app.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", {
    username: req.session.username,
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error while logging out");
    }

    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
