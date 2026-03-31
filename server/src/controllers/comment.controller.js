// src/controllers/comment.controller.js
const CommentService = require("@services/comment.service");

const CommentController = {
  create: async (req, res) => {
    try {
      const userId = req.user.id;
      const { postId } = req.params;
      const { content } = req.body;

      const comment = await CommentService.createComment(
        userId,
        postId,
        content
      );

      return res.status(201).json({ message: "Comment created", comment });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  reply: async (req, res) => {
    try {
      const userId = req.user.id;
      const { commentId } = req.params;
      const { content } = req.body;

      const reply = await CommentService.replyComment(
        userId,
        commentId,
        content
      );

      return res.status(201).json({ message: "Reply created", reply });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  list: async (req, res) => {
    try {
      const { postId } = req.params;

      const comments = await CommentService.getCommentsByPost(postId);

      return res.json({ message: "Comments fetched", comments });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const userId = req.user.id;
      const { commentId } = req.params;

      const result = await CommentService.deleteComment(commentId, userId);

      return res.json({ message: "Comment deleted", result });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

module.exports = CommentController;
