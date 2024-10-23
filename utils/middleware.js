// EXTERNAL DEPENDENCIES
const { campgroundSchema, reviewSchema } = require("../validation/schemas");
// INTERNAL DEPENDENCIES
const Campground = require("../models/campground");
const { catchAsync, catchSync } = require("../utils/catchers");
const AppError = require("../utils/AppError");

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

const isLoggedIn = (req, res, next) => {
  console.log("REQ.USER...", req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
  next();
};

const isCampgroundAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports = {
  isLoggedIn,
  storeReturnTo,
  isCampgroundAuthor,
  campgroundSchemaCheck,
  reviewSchemaCheck,
};
