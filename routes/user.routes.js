const express = require("express");
const router = express.Router();
const User = require("../middleware/jwt.middleware");

// GET /user/profile//  user by Id

router.get("/profile", User.isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { email, password, name, userType } = user;
      res.status(200).json({ user: { email, password, name, userType } });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error retrieving user profile", error: err })
    );
});

module.exports = router;
