// EXTERNAL DEPENDENCIES
const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

// INTERNAL DEPENDENCIES
const { catchAsync, catchSync } = require("../utils/catchers");
const { isLoggedIn, storeReturnTo } = require("../utils/middleware");
const {
  showRegisterUserForm,
  registerNewUser,
  authenticateUser,
  successfulUserAuthenticationRedirection,
  userLogout,
} = require("../controllers/userController");

// MONGOOSE MODELS
const User = require("../models/user");

// SHOW REGISTER USER FORM
router.get("/register", showRegisterUserForm);

// REGISTER NEW USER
router.post("/register", registerNewUser);

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
  storeReturnTo,
  authenticateUser,
  successfulUserAuthenticationRedirection
);

router.get("/logout", isLoggedIn, userLogout);

module.exports = router;
