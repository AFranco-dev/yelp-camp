// EXTERNAL DEPENDENCIES
const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

// INTERNAL DEPENDENCIES
const AppError = require("./utils/AppError");
const { wrapAsync, wrapSync } = require("./utils/wrappers");

// EXPRESS CONSTS
const app = express();
const port = 3000;
const dbPath = "mongodb://127.0.0.1:27017/yelp-camp";

// MONGOOSE MODELS
const Campground = require("./models/campground");

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
app.get("/", (req, res) => {
  res.render("home", { name: "Yelp Camp" });
});

// CAMPGROUND OPERATIONS
// CREATE
// CREATE NEW CAMPGROUND
app.post(
  "/campgrounds",
  wrapAsync(async (req, res) => {
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
  wrapSync((req, res) => {
    res.render("campground/create", { name: "Create New Campground" });
  })
);

// READ
// SHOW ALL CAMPGROUNDS
app.get(
  "/campgrounds",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campground/index", { campgrounds, name: "Campgrounds" });
  })
);
// SHOW CAMPGROUND WITH ID
app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/details", { campground, name: campground.title });
  })
);

// UPDATE
// EDIT CAMPGROUND BY ID
app.put(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
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
    if (campgroundEdited) {
      console.log(campgroundEdited);
      res.redirect(303, `/campgrounds/${id}`);
    } else {
      res.send("Campground not Found");
    }
  })
);
// SHOW EDIT CAMPGROUND BY ID FORM
app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res) => {
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
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campgroundDeleted = await Campground.findByIdAndDelete(id);
    if (campgroundDeleted) {
      console.log(campgroundDeleted);
      res.redirect(303, "/campgrounds");
    } else {
      res.send("Campground not Found");
    }
  })
);

// PRINTING ERROR NAME FOR CHECKING ERROR MORE SPECIFICALLY
app.use((err, req, res, next) => {
  if (err.name) {
    console.error(err.name);
    next(err);
  } else {
    console.error("No Name Error");
    next(err);
  }
});

// CUSTOM ERROR HANDLER, TO DEFINE AN ERROR HANDLER THE
// APP.USE NEED 4 PARAMETERS (err, req, res, next) TO
// BE CONSIDERED AN ERROR HANDLER
app.use((err, req, res, next) => {
  const { message = "Oops! We got an error!", status = 500 } = err;
  res.status(status).send(message);
});

// EXPRESS SERVER START AND DB CONNECTION
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  main().catch((err) => console.log(err));
});
