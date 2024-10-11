// EXTERNAL DEPENDENCIES
const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// INTERNAL DEPENDENCIES
const AppError = require("./utils/AppError");
const { catchAsync, catchSync } = require("./utils/catchers");
const User = require("./models/user");
// ROUTES
const campgroundsRouter = require("./routes/campgrounds");
const reviewsRouter = require("./routes/reviews");
const usersRouter = require("./routes/users");

// EXPRESS CONSTS
const app = express();
const port = 3000;
const dbPath = "mongodb://127.0.0.1:27017/yelp-camp";

// DEPENDENCIES CONSTS
// SESSION
const sessionConfig = {
  secret: "thisnotasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 27,
    maxAge: 1000 * 60 * 60 * 24 * 27,
  },
};

// MONGOOSE MODELS

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

// EXPRESS APP SET
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// EXPRESS APP USE MIDDLEWARE
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT SETUP
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// LOGGER
app.use(morgan("tiny"));

// FLASH MIDDLEWARE
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// EXPRESS APP USE MIDDLEWARE ROUTER
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

// GET HOME VIEW
app.get(
  "/",
  catchSync((req, res, next) => {
    res.render("home", { name: "Yelp Camp" });
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
