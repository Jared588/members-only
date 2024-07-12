const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// Display user form on GET
exports.user_create_get = asyncHandler(async (req, res, next) => {
  res.render("user_form", {
    title: "Register",
    user: {},
  });
});

// Handle user create on POST
exports.user_create_post = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified"),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Surname must be specified"),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be specified"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password must be specified"),
  body("confirm_password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password must be specified"),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Password confirmation
    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).send(`Passwords do not match`);
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create User object with escaped and trimmed data
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hashedPassword,
      membership: "default",
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanatized values/error messages
      res.render("user_form", {
        title: "Registration",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid
      // Save user
      await user.save();
      // Redirect to login
      res.redirect("/");
    }
  }),
];

// Display login page on GET
exports.user_login_get = asyncHandler(async (req, res, next) => {
  res.render("login_form", {
    title: "Login",
    username: req.body.username,
  });
});

// Handle login on POST
exports.user_login_post = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.redirect("/");
  },
];

// handle logout
exports.user_logout = asyncHandler((req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});