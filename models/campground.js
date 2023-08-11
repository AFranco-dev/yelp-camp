// DEPENDENCIES
const mongoose = require("mongoose");

// CONSTS
const Schema = mongoose.Schema;

// MONGOOSE
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
