// DEPENDENCIES
const mongoose = require("mongoose");

// CONSTS
const Schema = mongoose.Schema;

// MONGOOSE
const ReviewSchema = new Schema({
  body: String,
  rating: Number,
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
