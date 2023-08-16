// EXTERNAL DEPENDENCIES
const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

// INTERNAL DEPENDENCIES
const AppError = require("./utils/AppError");
const { catchAsync, catchSync } = require("./utils/catchers");
const { campgroundSchema } = require("./validation/schemas");

// EXPRESS CONSTS
const app = express();
const port = 3000;
const dbPath = "mongodb://127.0.0.1:27017/yelp-camp";

// MONGOOSE MODELS
const Campground = require("./models/campground");
const Review = require("./models/review");

// MONGOOSE SETUP
async function main() {
  try {
    mongoose.connection.on("connecting", () => console.log("¡Conectando!"));
    mongoose.connection.on("connected", () => console.log("¡Conectado!"));
    await mongoose.connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(error);
  }
}

// JOI SCHEMAS MIDDLEWARE
const campgroundSchemaCheck = catchAsync(async (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((x) => x.message).join(", ");
    return next(new AppError(msg, 400));
  } else {
    next();
  }
});
// EXPRESS APP SET
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// EXPRESS APP USE MIDDLEWARE
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// LOGGER
app.use(morgan("tiny"));

// GET HOME VIEW
app.get(
  "/",
  catchSync((req, res, next) => {
    res.render("home", { name: "Yelp Camp" });
  })
);

// CAMPGROUND OPERATIONS
// CREATE
// CREATE NEW CAMPGROUND
app.post(
  "/campgrounds",
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
    res.redirect("/campgrounds");
  })
);
// SHOW CREATE NEW CAMPGROUND FORM
app.get(
  "/campgrounds/create",
  catchSync((req, res, next) => {
    res.render("campground/create", { name: "Create New Campground" });
  })
);

// READ
// SHOW ALL CAMPGROUNDS
app.get(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find();
    res.render("campground/index", { campgrounds, name: "Campgrounds" });
  })
);
// SHOW CAMPGROUND WITH ID
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/details", { campground, name: campground.title });
  })
);

// UPDATE
// EDIT CAMPGROUND BY ID
app.put(
  "/campgrounds/:id",
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
    if (campgroundEdited) res.redirect(303, `/campgrounds/${id}`);
  })
);
// SHOW EDIT CAMPGROUND BY ID FORM
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/edit", {
      campground,
      name: `Edit ${campground.title}`,
    });
  })
);

// DELETE
// DELETE CAMPGROUND BY ID
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campgroundDeleted = await Campground.findByIdAndDelete(id);
    if (campgroundDeleted) res.redirect(303, "/campgrounds");
  })
);

// WILDCARD ROUTE FOR HANDLING NOT FOUND ROUTES
app.all("*", (req, res, next) => {
  next(new AppError("Not Found 404", 404));
});

// PRINTING ERROR NAME FOR CHECKING ERROR MORE SPECIFICALLY
// ADDED STATUS AND MESSAGE ERROR ON CONSOLE
app.use((err, req, res, next) => {
  const {
    name = "No Name",
    message = "Oops! We got an error!",
    status = 500,
  } = err;
  const msg = `Name: ${name}\nStatus: ${status}\nMessage: ${message}`;
  console.error(msg);
  next(err);
});

// CUSTOM ERROR HANDLER, TO DEFINE AN ERROR HANDLER THE
// APP.USE NEED 4 PARAMETERS (err, req, res, next) TO
// BE CONSIDERED AN ERROR HANDLER
app.use((err, req, res, next) => {
  const {
    name = "No Name",
    message = "Oops! We got an error!",
    status = 500,
  } = err;
  res.status(status).render("error/error", { name, message, status });
});

// EXPRESS SERVER START AND DB CONNECTION
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  main().catch((err) => console.log(err));
});
