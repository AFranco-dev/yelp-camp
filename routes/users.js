const express = require("express");
const router = express.Router({ mergeParams: true });

// INTERNAL DEPENDENCIES
const { catchAsync, catchSync } = require("../utils/catchers");
const AppError = require("../utils/AppError");

// MONGOOSE MODELS
const User = require("../models/user");

// SHOW REGISTER USER FORM
router.get(
  "/register",
  catchSync((req, res, next) => {
    res.render("user/register", { name: "Register" });
  })
);

// REGISTER NEW USER
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      const newUserRegistered = User.register(newUser, password);
      console.log(newUserRegistered);
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);

module.exports = router;
