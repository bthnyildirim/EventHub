const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EventSchema = new Schema({
  title: {
    type: String,
    required: [true, "Email is required."],
  },
  description: {
    type: String,
    required: [true, "Description is required."],
  },
  dateTime: { type: Date, required: [true, "Date and time are required."] },
  pricing: {
    min: { type: Number, required: [true, "Minimum price is required."] },
    max: { type: Number, required: [true, "Maximum Price is required."] },
  },
  map: { type: String },
  image: { type: String },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
});
const Event = model("Event", EventSchema);
module.exports = Event;
