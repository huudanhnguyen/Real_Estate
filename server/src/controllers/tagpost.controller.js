const TagPostService = require("@services/tagpost.service");

const TagPostController = {
  getTagsByPost: async (req, res) => {
    try {
      const { postId } = req.params;
      const tags = await TagPostService.getTagsByPost(postId);
      res.json({ tags });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addTag: async (req, res) => {
    try {
      const { postId } = req.params;
      const { tagId } = req.body;

      await TagPostService.addTag(postId, tagId);
      res.json({ message: "Thêm tag thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  removeTag: async (req, res) => {
    try {
      const { postId } = req.params;
      const { tagId } = req.body;

      await TagPostService.removeTag(postId, tagId);
      res.json({ message: "Xóa tag thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = TagPostController;
