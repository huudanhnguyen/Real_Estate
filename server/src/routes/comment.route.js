// src/routes/comment.route.js
const express = require("express");
const verifyToken = require("@middlewares/auth.middleware");
const CommentController = require("@controllers/comment.controller");

const router = express.Router();

// Create comment
router.post("/:postId", verifyToken, (req, res) =>
  CommentController.create(req, res)
);

// Reply comment
router.post("/reply/:commentId", verifyToken, (req, res) =>
  CommentController.reply(req, res)
);

// List comments
router.get("/:postId", (req, res) => CommentController.list(req, res));

// Delete comment
router.delete("/:commentId", verifyToken, (req, res) =>
  CommentController.delete(req, res)
);

module.exports = router;
