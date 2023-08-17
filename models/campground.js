// DEPENDENCIES
const mongoose = require("mongoose");

// CONSTS
const { Schema } = mongoose;

// MONGOOSE
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
