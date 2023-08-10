const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const dbPath = "mongodb://127.0.0.1:27017/yelp-camp";

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(dbPath).then((x) => console.log(x));
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
      // RANDOM NUMBERS
      const randomCityNumber = Math.floor(Math.random() * cities.length);
      const randomDescriptorNumber = Math.floor(
        Math.random() * descriptors.length
      );
      const randomPlaceNumber = Math.floor(Math.random() * places.length);
      // RANDOM VARIABLES
      const city = cities[randomCityNumber];
      const descriptor = descriptors[randomDescriptorNumber];
      const place = places[randomPlaceNumber];
      // CAMPGROUND FIELDS
      const location = `${city.city}, ${city.state}`;
      const title = `${descriptor} ${place}`;
      // CAMPGROUND CREATION
      const newCampground = new Campground({
        location: location,
        title: title,
      });
      await newCampground.save();
    }
  } catch (error) {
    console.error(error);
  }
}
