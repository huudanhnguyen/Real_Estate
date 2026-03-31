// src/services/comment.service.js
const { Comment, User } = require("@models");
const { Op } = require("sequelize");

const CommentService = {
  // Create root comment
  createComment: async (userId, postId, content) => {
    const comment = await Comment.create({
      idUser: userId,
      idPost: postId,
      content,
      idParent: null,
    });

    return comment;
  },

  // Reply to a comment
  replyComment: async (userId, parentId, content) => {
    const parent = await Comment.findByPk(parentId);
    if (!parent) throw new Error("Parent comment not found");

    const reply = await Comment.create({
      idUser: userId,
      idPost: parent.idPost,
      content,
      idParent: parentId,
    });

    return reply;
  },

  // Get comments tree for a post
  getCommentsByPost: async (postId) => {
    const comments = await Comment.findAll({
      where: { idPost: postId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "avatar"],
        },
      ],
    });

    // Convert flat list → tree
    const map = {};
    const roots = [];

    comments.forEach((c) => {
      map[c.id] = { ...c.dataValues, replies: [] };
    });

    comments.forEach((c) => {
      if (c.idParent === null) {
        roots.push(map[c.id]);
      } else {
        if (map[c.idParent]) {
          map[c.idParent].replies.push(map[c.id]);
        }
      }
    });

    return roots;
  },

  deleteComment: async (commentId, userId) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");

    // Only owner can delete
    if (comment.idUser !== userId) throw new Error("Not allowed");

    await comment.destroy();
    return { deleted: true };
  },
};

module.exports = CommentService;
