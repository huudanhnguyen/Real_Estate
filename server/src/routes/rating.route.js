// src/routes/rating.route.js
const express = require("express");
const verifyToken = require("@middlewares/auth.middleware");
const RatingController = require("@controllers/rating.controller");

const router = express.Router();

// Create or update rating
router.post("/:postId", verifyToken, (req, res) =>
  RatingController.createOrUpdate(req, res)
);

// Get ratings for post
router.get("/:postId", (req, res) => RatingController.list(req, res));

// Delete a rating
router.delete("/:ratingId", verifyToken, (req, res) =>
  RatingController.delete(req, res)
);

module.exports = router;
