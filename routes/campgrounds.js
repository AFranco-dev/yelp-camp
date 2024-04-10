const express = require("express");
const router = express.Router({ mergeParams: true });
const { campgroundSchema } = require("../validation/schemas");
// INTERNAL DEPENDENCIES
const { catchAsync, catchSync } = require("../utils/catchers");
const AppError = require("../utils/AppError");

// MONGOOSE MODELS
const Campground = require("../models/campground");

// JOI SCHEMAS MIDDLEWARE
const campgroundSchemaCheck = catchAsync(async (req, res, next) => {
  const { title, image, price, description, location } = req.body;
  const { error } = campgroundSchema.validate({
    campground: {
      title,
      image,
      price,
      description,
      location,
    },
  });
  if (error) {
    const msg = error.details.map((x) => x.message).join(", ");
    return next(new AppError(msg, 400));
  } else {
    next();
  }
});

// CAMPGROUND OPERATIONS
// CREATE
// CREATE NEW CAMPGROUND
router.post(
  "",
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
    });
    await newCampground.save();
    req.flash("success", "Successfully made a new Campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
// SHOW CREATE NEW CAMPGROUND FORM
router.get(
  "/create",
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
    const campground = await Campground.findById(id).populate("reviews");
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
