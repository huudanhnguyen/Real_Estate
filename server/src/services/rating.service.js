// src/services/rating.service.js
const { Rating, Post, User } = require("@models");
const { Op } = require("sequelize");

const RatingService = {
  // Create or update rating
  ratePost: async (userId, postId, star, content) => {
    // Check post exists
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post not found");

    // Check if rated before
    const exist = await Rating.findOne({
      where: { idUser: userId, idPost: postId },
    });

    let rating;

    if (exist) {
      // Update existing rating
      exist.star = star;
      exist.content = content;
      await exist.save();
      rating = exist;
    } else {
      // Create new rating
      rating = await Rating.create({
        idUser: userId,
        idPost: postId,
        star,
        content,
      });
    }

    // Update avgStar
    await RatingService.updateAvgStar(postId);

    return rating;
  },

  // Recalculate avgStar for posts table
  updateAvgStar: async (postId) => {
    const ratings = await Rating.findAll({
      where: { idPost: postId },
      attributes: ["star"],
    });

    if (ratings.length === 0) {
      await Post.update({ avgStar: 0 }, { where: { id: postId } });
      return;
    }

    const avg = ratings.reduce((sum, r) => sum + r.star, 0) / ratings.length;

    await Post.update({ avgStar: avg.toFixed(1) }, { where: { id: postId } });
  },

  // Get all ratings for a post
  getRatings: async (postId) => {
    const ratings = await Rating.findAll({
      where: { idPost: postId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "avatar"],
        },
      ],
    });

    return ratings;
  },

  // Delete rating
  deleteRating: async (ratingId, userId) => {
    const rating = await Rating.findByPk(ratingId);

    if (!rating) throw new Error("Rating not found");

    // Only owner can delete
    if (rating.idUser !== userId) throw new Error("Not allowed");

    const postId = rating.idPost;

    await rating.destroy();

    // recompute avgStar
    await RatingService.updateAvgStar(postId);

    return { deleted: true };
  },
};

module.exports = RatingService;
