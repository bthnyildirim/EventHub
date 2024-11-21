const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const VenueSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required."], index: true },
    capacity: {
      type: Number,
      required: [true, "Capacity information is required."],
      min: [1, "Capacity must be at least 1."],
    },
    location: {
      town: { type: String, required: [true, "Town is required."] },
      streetName: {
        type: String,
        required: [true, "Street name is required."],
      },
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

const Venue = model("Venue", VenueSchema);
module.exports = Venue;
