// DEPENDENCIES
const mongoose = require("mongoose");
const Review = require("./review");

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

CampgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
