const express = require("express");
const router = express.Router({ mergeParams: true });
// INTERNAL DEPENDENCIES
// MIDDLEWARE
const {
  isLoggedIn,
  reviewSchemaCheck,
  isReviewAuthor,
} = require("../utils/middleware");
// CONTROLLERS
const {
  createReview,
  editReviewWithId,
  deleteReviewWithId,
} = require("../controllers/reviewController");

// CAMPGROUND REVIEWS OPERATIONS
// CREATE
// CREATE NEW REVIEW
router.post("/", isLoggedIn, reviewSchemaCheck, createReview);

// SHOW CREATE NEW REVIEW FORM
// READ
// UPDATE
// EDIT REVIEW WITH ID
router.put(
  "/",
  isLoggedIn,
  isReviewAuthor,
  reviewSchemaCheck,
  editReviewWithId
);
// SHOW EDIT REVIEW FORM
// DELETE
// DELETE REVIEW
router.delete("/", isLoggedIn, isReviewAuthor, deleteReviewWithId);

module.exports = router;
