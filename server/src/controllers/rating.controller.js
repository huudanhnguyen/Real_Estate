// src/controllers/rating.controller.js
const RatingService = require("@services/rating.service");

const RatingController = {
  createOrUpdate: async (req, res) => {
    try {
      const userId = req.user.id;
      const { postId } = req.params;
      const { star, content } = req.body;

      const rating = await RatingService.ratePost(
        userId,
        postId,
        star,
        content
      );

      return res.status(201).json({
        message: "Rating saved",
        rating,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  list: async (req, res) => {
    try {
      const { postId } = req.params;

      const ratings = await RatingService.getRatings(postId);

      return res.json({
        message: "Ratings fetched",
        ratings,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const userId = req.user.id;
      const { ratingId } = req.params;

      const result = await RatingService.deleteRating(ratingId, userId);

      return res.json({ message: "Rating deleted", result });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

module.exports = RatingController;
