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

module.exports = router;
