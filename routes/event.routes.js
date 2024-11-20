const router = require("express").Router();
const Event = require("../models/Event.model");
const isAuthenticated = require("../middleware/jwt.middleware");

// Middleware to check organizer role
const isOrganizer = (req, res, next) => {
  const userRole = req.payload.typeofuser;
  if (userRole === "organizer") {
    return next();
  } else {
    return res
      .status(403)
      .json({ message: "Access forbidden: Organizers only." });
  }
};

//POST/api/events CREATE A NEW EVENT
router.post("/api/events", isAuthenticated, isOrganizer, (req, res, next) => {
  const newEvent = req.body;
  Event.create(newEvent)
    .then((eventFromDB) => {
      res.status(201).json(eventFromDB);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /api/events - Retrieves all of the events in the database collection
router.get("/api/events", (req, res, next) => {
  Event.find()
    .populate("venue")
    .then((eventFromDB) => {
      res.status(200).json(eventFromDB);
    })
    .catch((err) => {
      next(err);
    });
});

//GET/api/events/:eventid - retrieves a spesific event by id

router.get("/api/events/:eventsId", (req, res, next) => {
  const { eventId } = req.params.id;

  Event.findById(eventId)
    .then((eventFromDB) => {
      if (!eventFromDB) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(eventFromDB);
    })
    .catch((err) => {
      next(err);
    });
});

//PUT/ api/events/eventid - update a spesific event by id

router.put(
  "/api/events/:eventId",
  isAuthenticated,
  isOrganizer,
  (req, res, next) => {
    const { eventId } = req.params;
    const newDetails = req.body;

    Event.findByIdAndUpdate(eventId, newDetails, { new: true })
      .then((eventFromDB) => {
        if (!eventFromDB) {
          return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json(eventFromDB);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// DELETE /api/events/:eventId - Deletes a specific event by id
router.delete(
  "/api/events/:eventId",
  isAuthenticated,
  isOrganizer,
  (req, res, next) => {
    const { eventId } = req.params;

    Event.findByIdAndDelete(eventId)
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        next(err);
        console.error("Error deleting event...");
        res.status(500).json({ error: "Failed to delete the event" });
      });
  }
);
module.exports = router;
