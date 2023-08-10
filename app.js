// EXTERNAL DEPENDENCIES
const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");

// EXPRESS CONSTS
const app = express();
const port = 3000;
const dbPath = "mongodb://127.0.0.1:27017/yelp-camp";

// MONGOOSE MODELS
const Campground = require("./models/campground");
const { title } = require("process");

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
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// EXPRESS APP USE MIDDLEWARE
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// GET HOME VIEW
app.get("/", (req, res) => {
  // res.locals.name = "Yelp Camp";
  // res.render("home");
  res.render("home", { name: "Yelp Camp" });
});

// CAMPGROUND OPERATIONS
// CREATE
// CREATE NEW CAMPGROUND
app.post("/campgrounds", async (req, res) => {
  try {
    console.dir(req.body);
    const { title, price, description, location } = req.body;
    const newCampground = new Campground({
      title,
      price,
      description,
      location,
    });
    await newCampground.save();
    res.redirect("/campgrounds");
  } catch (error) {
    console.error(error);
  }
});
// SHOW CREATE NEW CAMPGROUND FORM
app.get("/campgrounds/create", async (req, res) => {
  res.render("campground/create", { name: "Create New Campground" });
});

// READ
// SHOW ALL CAMPGROUNDS
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find();
  res.render("campground/index", { campgrounds, name: "Campgrounds" });
});
// SHOW CAMPGROUND WITH ID
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campground/details", { campground, name: campground.title });
});

// UPDATE
// EDIT CAMPGROUND BY ID
app.put("/campgrounds/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, description, location } = req.body;
    const campgroundEdited = await Campground.findByIdAndUpdate(
      id,
      {
        title,
        price,
        description,
        location,
      },
      { runValidators: true }
    );
    if (campgroundEdited) {
      console.log(campgroundEdited);
      res.redirect(303, `/campgrounds/${id}`);
    } else {
      res.send("Campground not Found");
    }
  } catch (error) {
    console.log(error);
  }
});
// SHOW EDIT CAMPGROUND BY ID FORM
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campground/edit", { campground, name: `Edit ${title}` });
});

// DELETE
// DELETE CAMPGROUND BY ID
app.delete("/campgrounds/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const campgroundDeleted = await Campground.findByIdAndDelete(id);
    if (campgroundDeleted) {
      console.log(campgroundDeleted);
      res.redirect(303, "/campgrounds");
    } else {
      res.send("Campground not Found");
    }
  } catch (error) {
    console.log(error);
  }
});

// EXPRESS SERVER START AND DB CONNECTION
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  main().catch((err) => console.log(err));
});
