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
      const randomPrice = Math.floor(Math.random() * 40) + 10;
      // RANDOM VARIABLES
      const city = cities[randomCityNumber];
      const descriptor = descriptors[randomDescriptorNumber];
      const place = places[randomPlaceNumber];
      // CAMPGROUND FIELDS
      const location = `${city.city}, ${city.state}`;
      const title = `${descriptor} ${place}`;
      // CAMPGROUND CREATION
      const newCampground = new Campground({
        title: title,
        image: "https://source.unsplash.com/random/300x300?sig=1",
        price: randomPrice,
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde itaque optio totam ipsum quos nostrum. Vitae atque quasi porro explicabo, voluptate ullam ex, laborum assumenda sapiente ut omnis! Quam, enim! Consequuntur ad saepe officiis exercitationem inventore sequi, mollitia quaerat tempora, laborum provident dolores laboriosam. Dicta consectetur facere sunt aperiam, quo sit illum est dignissimos pariatur suscipit ex eius eaque nostrum? Suscipit officia quaerat, natus eius labore placeat adipisci quisquam, sapiente iusto voluptates nesciunt perferendis animi quis nobis nulla impedit dolorem, corrupti omnis neque? Culpa eligendi nam, amet ipsum minus officia!",
        location: location,
      });
      await newCampground.save();
    }
  } catch (error) {
    console.error(error);
  }
}
