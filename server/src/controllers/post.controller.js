const PostService = require("@services/post.service");

const PostController = {
  create: async (req, res) => {
    try {
      const userId = req.user.id;

      if (req.user.role === "admin") {
        return res.status(403).json({
          message: "Admin không được đăng tin",
        });
      }

      const newPost = await PostService.createPost(userId, req.body);

      return res.status(201).json({
        message: "Tạo bài đăng thành công",
        post: newPost,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  list: async (req, res) => {
    try {
      const result = await PostService.getAllPosts(req.query);

      return res.status(200).json({
        message: "Lấy danh sách bài đăng thành công",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  detail: async (req, res) => {
    try {
      const { idPost } = req.params;

      if (!idPost) {
        return res.status(400).json({
          message: "Thiếu idPost",
        });
      }

      const post = await PostService.getPostDetail(idPost);

      return res.status(200).json({
        message: "Lấy bài đăng thành công",
        post,
      });
    } catch (err) {
      return res.status(404).json({
        message: err.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { idPost } = req.params;
      const userId = req.user.id;

      if (!idPost) {
        return res.status(400).json({
          message: "Thiếu idPost",
        });
      }

      const updatedPost = await PostService.updatePost(
        idPost,
        userId,
        req.body,
      );

      return res.status(200).json({
        message: "Cập nhật bài đăng thành công",
        post: updatedPost,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { idPost } = req.params;
      const userId = req.user.id;

      if (!idPost) {
        return res.status(400).json({
          message: "Thiếu idPost",
        });
      }

      const result = await PostService.deletePost(idPost, userId);

      return res.status(200).json({
        message: "Xoá bài đăng thành công",
        result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },
};

module.exports = PostController;
