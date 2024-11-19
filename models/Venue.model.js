const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const VenueSchema = new Schema({
  name: { type: String, required: [true, "Name is required."] },
  capacity: {
    type: Number,
    required: [true, "Capacity information is required."],
  },
  location: {
    town: { type: String, required: [true, "Town is required."] },
    streetName: { type: String, required: [true, "Street name is required."] },
  },
});

const Venue = model("Venue", VenueSchema);
module.exports = Venue;
