const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// GET/API/HEALTH

router.get("/health", (req, res) => {
  mongoose.connection.db
    .admin()
    .ping()
    .then(() => {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    })
    .catch((err) => {
      console.error("MongoDB ping failed:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to connect MongoDB",
      });
    });
});

module.exports = router;
