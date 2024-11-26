const router = require("express").Router();
const Event = require("../models/Event.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Middleware to check organizer role
const isOrganizer = (req, res, next) => {
  console.log("Payload:", req.payload); // Debugging
  const userRole = req.payload.userType; // Ensure userType exists in the payload
  if (userRole === "organizer") {
    return next();
  } else {
    return res
      .status(403)
      .json({ message: "Access forbidden: Organizers only." });
  }
};

// POST /events - Create a new event
router.post("/events", isAuthenticated, isOrganizer, (req, res, next) => {
  const { title, description, dateTime, pricing, map, image, venue } = req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !dateTime ||
    !pricing?.min ||
    !pricing?.max ||
    !venue
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  Event.create({
    title,
    description,
    dateTime,
    pricing,
    map,
    image,
    venue,
    organizer: req.payload._id,
  })
    .then((event) => res.status(201).json(event))
    .catch((err) => next(err));
});

// GET /api/events - Retrieve all events
router.get("/events", (req, res, next) => {
  Event.find()
    .populate("venue")
    .then((events) => res.status(200).json(events))
    .catch((err) => next(err));
});

// GET /events/:eventsId - Retrieve a specific event
router.get("/events/:eventsId", (req, res, next) => {
  const { eventsId } = req.params;

  Event.findById(eventsId)
    .populate("venue")
    .then((event) => {
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(event);
    })
    .catch((err) => next(err));
});

// PUT /events/:eventId - Update a specific event
router.put(
  "/events/:eventId",
  isAuthenticated,
  isOrganizer,
  (req, res, next) => {
    const { eventId } = req.params;
    const newDetails = req.body;

    if (!newDetails.title && !newDetails.description && !newDetails.dateTime) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    Event.findByIdAndUpdate(eventId, newDetails, { new: true })
      .populate("venue")
      .then((updatedEvent) => {
        if (!updatedEvent) {
          return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json(updatedEvent);
      })
      .catch((err) => next(err));
  }
);

// DELETE /events/:eventId - Delete a specific event
router.delete(
  "/events/:eventId",
  isAuthenticated,
  isOrganizer,
  (req, res, next) => {
    const { eventId } = req.params;

    Event.findByIdAndDelete(eventId)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  }
);

module.exports = router;
