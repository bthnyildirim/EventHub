const router = require("express").Router();
const Event = require("../models/Event.model");
const Venue = require("../models/Venue.model");
const multer = require("multer");
const path = require("path");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Middleware to check organizer role
const isOrganizer = (req, res, next) => {
  const userRole = req.payload.userType; // Ensure userType exists in the payload
  if (userRole === "organizer") {
    return next();
  } else {
    return res
      .status(403)
      .json({ message: "Access forbidden: Organizers only." });
  }
};

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// POST /events - Create a new event
router.post(
  "/events",
  isAuthenticated,
  isOrganizer,
  upload.single("image"), // Handle the image upload
  (req, res, next) => {
    const { title, description, dateTime, pricing, venue } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : ""; // Updated image path

    // Validate required fields
    if (
      !title ||
      !description ||
      !dateTime ||
      !pricing?.min ||
      !pricing?.max ||
      !venue ||
      !image
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    Event.create({
      title,
      description,
      dateTime,
      pricing,
      map: "default_map_value", // Add default value if 'map' is required
      image,
      venue,
      organizer: req.payload._id,
    })
      .then((event) => res.status(201).json(event))
      .catch((err) => next(err));
  }
);

// GET /events - Retrieve all events
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
  upload.single("image"), // Allow updating the image
  (req, res, next) => {
    const { eventId } = req.params;
    const newDetails = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : ""; // Updated image path

    if (
      !newDetails.title &&
      !newDetails.description &&
      !newDetails.dateTime &&
      !image
    ) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Include image path in the update if provided
    const updateFields = { ...newDetails };
    if (image) updateFields.image = image;

    Event.findByIdAndUpdate(eventId, updateFields, { new: true })
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
