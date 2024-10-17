const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../validation/schemas");
// INTERNAL DEPENDENCIES
const { catchAsync, catchSync } = require("../utils/catchers");
const AppError = require("../utils/AppError");
const { isLoggedIn } = require("../utils/middleware");

// MONGOOSE MODELS
const Review = require("../models/review");
const Campground = require("../models/campground");

// JOI SCHEMAS MIDDLEWARE
const reviewSchemaCheck = catchAsync(async (req, res, next) => {
  const { rating, body } = req.body;
  const { error } = reviewSchema.validate({
    review: {
      rating,
      body,
    },
  });
  if (error) {
    const msg = error.details.map((x) => x.message).join(", ");
    return next(new AppError(msg, 400));
  } else {
    next();
  }
});

// CAMPGROUND REVIEWS OPERATIONS
// CREATE
// CREATE NEW REVIEW
router.post(
  "/",
  isLoggedIn,
  reviewSchemaCheck,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { body, rating } = req.body;
    const review = new Review({ body, rating });
    const savedReview = await review.save();
    const updatedCampground = await Campground.findByIdAndUpdate(id, {
      $push: { reviews: savedReview._id },
    });
    if (updatedCampground) {
      req.flash("success", `Successfully created the review!`);
      res.redirect("back");
    }
  })
);
// db.campgrounds.find({_id: ObjectId("64d698bd4c68967599ddefc8")})

// SHOW CREATE NEW REVIEW FORM
// READ
// UPDATE
// EDIT REVIEW
router.put(
  "/",
  isLoggedIn,
  reviewSchemaCheck,
  catchAsync(async (req, res, next) => {
    const { idReview, body, rating } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(idReview, {
      body,
      rating,
    });
    if (updatedReview) {
      req.flash("success", `Successfully edited the review!`);
      res.redirect("back");
    }
  })
);
// SHOW EDIT REVIEW FORM
// DELETE
// DELETE REVIEW
router.delete(
  "/",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { idReview } = req.body;
    console.log(idReview);
    updatedCampground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: idReview },
    });
    const deletedReview = await Review.findByIdAndDelete(idReview);
    console.log(updatedCampground);
    console.log(deletedReview);
    if (deletedReview) {
      req.flash("success", `Successfully deleted the review!`);
      res.redirect("back");
    }
  })
);

module.exports = router;
