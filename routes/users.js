// EXTERNAL DEPENDENCIES
const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

// INTERNAL DEPENDENCIES
const { catchAsync, catchSync } = require("../utils/catchers");
const AppError = require("../utils/AppError");
const { isLoggedIn } = require("../utils/middleware");

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

// SHOW LOGIN USER FORM
router.get(
  "/login",
  catchSync((req, res, next) => {
    res.render("user/login", { name: "Login" });
  })
);

// LOGIN USER
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(async (req, res, next) => {
    req.flash("success", "Welcome back!");
    res.redirect("/campgrounds");
  })
);

router.get(
  "/logout",
  isLoggedIn,
  catchSync((req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "See you later!");
      res.redirect("/campgrounds");
    });
  })
);

module.exports = router;
