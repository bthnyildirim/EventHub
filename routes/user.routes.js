const express = require("express");
const router = express.Router();
const User = require("../models/User.model"); // Import User model
const { isAuthenticated } = require("../middleware/jwt.middleware"); // Import isAuthenticated middleware

// GET /user/profile - Retrieve logged-in user's profile
router.get("/profile", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Exclude password from the response
      const { email, name, userType } = user;
      res.status(200).json({ user: { email, name, userType } });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error retrieving user profile", error: err })
    );
});

// GET /user/:id - Retrieve any user by ID
router.get("/:id", isAuthenticated, (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Exclude password from the response
      const { email, name, userType } = user;
      res.status(200).json({ user: { email, name, userType } });
    })
    .catch((err) => {
      console.error("Error retrieving user by ID:", err);
      res
        .status(500)
        .json({ message: "Error retrieving user by ID", error: err });
    });
});

module.exports = router;
