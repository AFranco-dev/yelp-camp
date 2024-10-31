// MONGOOSE MODELS
const Campground = require("../models/campground");
// INTERNAL DEPENDENCIES
const { catchAsync, catchSync } = require("../utils/catchers");

const createCampground = catchAsync(async (req, res, next) => {
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
});

const showCreateCampgroundForm = catchSync((req, res, next) => {
  res.render("campground/create", {
    name: "Create New Campground",
  });
});

const showCampgroundIndex = catchAsync(async (req, res, next) => {
  const campgrounds = await Campground.find();
  res.render("campground/index", { campgrounds, name: "Campgrounds" });
});

const showCampgroundWithId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campground/details", { campground, name: campground.title });
});

const editCampgroundWithId = catchAsync(async (req, res, next) => {
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
});

const showEditCampgroundWithIdForm = catchAsync(async (req, res, next) => {
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
});

const deleteCampgroundWithId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campgroundDeleted = await Campground.findByIdAndDelete(id);
  if (campgroundDeleted) {
    req.flash(
      "success",
      `Successfully deleted the campground ${campgroundDeleted.title}!`
    );
    res.redirect(303, "/campgrounds");
  }
});

module.exports = {
  createCampground,
  showCreateCampgroundForm,
  showCampgroundIndex,
  showCampgroundWithId,
  editCampgroundWithId,
  showEditCampgroundWithIdForm,
  deleteCampgroundWithId,
};
