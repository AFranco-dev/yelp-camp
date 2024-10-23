// EXTERNAL DEPENDENCIES
const express = require("express");
const router = express.Router({ mergeParams: true });

// INTERNAL DEPENDENCIES
const { catchAsync, catchSync } = require("../utils/catchers");
const AppError = require("../utils/AppError");
const {
  isLoggedIn,
  isCampgroundAuthor,
  campgroundSchemaCheck,
} = require("../utils/middleware");

// MONGOOSE MODELS
const Campground = require("../models/campground");

// CAMPGROUND OPERATIONS
// CREATE
// CREATE NEW CAMPGROUND
router.post(
  "",
  isLoggedIn,
  campgroundSchemaCheck,
  catchAsync(async (req, res, next) => {
    console.dir(req.body);
    const { title, price, description, location, image } = req.body;
    const newCampground = new Campground({
      title,
      price,
      description,
      location,
      image,
      author: req.user._id,
    });
    await newCampground.save();
    req.flash("success", "Successfully made a new Campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
// SHOW CREATE NEW CAMPGROUND FORM
router.get(
  "/create",
  isLoggedIn,
  catchSync((req, res, next) => {
    res.render("campground/create", {
      name: "Create New Campground",
    });
  })
);

// READ
// SHOW ALL CAMPGROUNDS
router.get(
  "",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find();
    res.render("campground/index", { campgrounds, name: "Campgrounds" });
  })
);
// SHOW CAMPGROUND WITH ID
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campground/details", { campground, name: campground.title });
  })
);

// UPDATE
// EDIT CAMPGROUND BY ID
router.put(
  "/:id",
  isLoggedIn,
  isCampgroundAuthor,
  campgroundSchemaCheck,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, price, description, location, image } = req.body;
    const campgroundEdited = await Campground.findByIdAndUpdate(
      id,
      {
        title,
        price,
        description,
        location,
        image,
      },
      { runValidators: true }
    );
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    if (campgroundEdited) {
      req.flash("success", "Successfully edited a Campground!");
      res.redirect(303, `/campgrounds/${id}`);
    }
  })
);
// SHOW EDIT CAMPGROUND BY ID FORM
router.get(
  "/:id/edit",
  isLoggedIn,
  isCampgroundAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campground/edit", {
      campground,
      name: `Edit ${campground.title}`,
    });
  })
);

// DELETE
// DELETE CAMPGROUND BY ID
router.delete(
  "/:id",
  isLoggedIn,
  isCampgroundAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campgroundDeleted = await Campground.findByIdAndDelete(id);
    if (campgroundDeleted) {
      req.flash(
        "success",
        `Successfully deleted the campground ${campgroundDeleted.title}!`
      );
      res.redirect(303, "/campgrounds");
    }
  })
);

module.exports = router;
