const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");

const app = express();

// EJS
app.set("view engine", "ejs");

// Read form data
app.use(express.urlencoded({ extended: true }));

// Redis connection
const redisClient = createClient({
  url: "redis://default:R6YFFuVH2HNhXZ8wCwU4MCrNY7oz1ynD@juried-turbofine-orris-73906.db.redis.io:15472",
});

// Redis error
redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

// Connect Redis
redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.log("Redis connection error:", err);
  });

// Redis session store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// Session
app.use(
  session({
    store: redisStore,

    secret: "my-secret-key",

    resave: false,

    saveUninitialized: false,

    cookie: {
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

// Authentication middleware
function isLoggedIn(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/");
  }
}

// Protected Route 1
app.get("/home", isLoggedIn, (req, res) => {
  res.render("home", {
    username: req.session.username,
  });
});

// Protected Route 2
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

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
