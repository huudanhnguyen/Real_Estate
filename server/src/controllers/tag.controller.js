const TagService = require("@services/tag.service");

const TagController = {
  getAll: async (req, res) => {
    try {
      const tags = await TagService.getAllTags();
      res.status(200).json({ tags });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { tag } = req.body;
      const newTag = await TagService.createTag(tag);
      res.status(201).json({ message: "Tạo tag thành công", tag: newTag });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await TagService.deleteTag(id);
      res.status(200).json({ message: "Xóa tag thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = TagController;
