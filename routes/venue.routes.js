const express = require("express");
const router = express.Router();
const Venue = require("../models/Venue.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Middleware to check organizer role
const isOrganizer = (req, res, next) => {
  const userRole = req.payload.userType;
  if (userRole === "organizer") {
    return next(); // User is an organizer, proceed
  } else {
    return res
      .status(403)
      .json({ message: "Access forbidden: Organizers only." });
  }
};

// POST /venues - Create a new venue (Organizers only)
router.post("/", isAuthenticated, isOrganizer, (req, res, next) => {
  const { name, capacity, location } = req.body;

  // Validate required fields
  if (!name || !capacity || !location?.town || !location?.streetName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  Venue.create({ name, capacity, location })
    .then((venue) => {
      res.status(201).json(venue);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /venues - Retrieve all venues (Accessible to everyone)
router.get("/", (req, res, next) => {
  Venue.find()
    .then((venues) => {
      res.status(200).json(venues);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /venues/:id - Retrieve details of a specific venue
router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  Venue.findById(id)
    .then((venue) => {
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      res.status(200).json(venue);
    })
    .catch((err) => {
      next(err);
    });
});

// PUT /venues/:id - Update a venue (Organizers only)
router.put("/:id", isAuthenticated, isOrganizer, (req, res, next) => {
  const { id } = req.params;
  const updatedDetails = req.body;

  Venue.findByIdAndUpdate(id, updatedDetails, { new: true })
    .then((venue) => {
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      res.status(200).json(venue);
    })
    .catch((err) => {
      next(err);
    });
});

// DELETE /venues/:id - Delete a venue (Organizers only)
router.delete("/:id", isAuthenticated, isOrganizer, (req, res, next) => {
  const { id } = req.params;

  Venue.findByIdAndDelete(id)
    .then((venue) => {
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
