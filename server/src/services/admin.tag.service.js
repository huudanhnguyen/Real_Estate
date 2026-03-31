const { Tag, Post } = require("@models");

const AdminTagService = {
  // =====================
  // GET ALL TAGS
  // =====================
  getTags: async () => {
    return await Tag.findAll({
      order: [["createdAt", "DESC"]],
    });
  },

  // =====================
  // CREATE TAG
  // =====================
  createTag: async (name) => {
    if (!name || !name.trim()) {
      throw new Error("Tên tag không hợp lệ");
    }

    const existed = await Tag.findOne({
      where: { name },
    });

    if (existed) {
      throw new Error("Tag đã tồn tại");
    }

    return await Tag.create({ name });
  },

  // =====================
  // DELETE TAG
  // =====================
  deleteTag: async (id) => {
    const tag = await Tag.findByPk(id);
    if (!tag) throw new Error("Tag không tồn tại");

    // ❌ Không cho xoá nếu đang được dùng
    const usedCount = await tag.countPosts();
    if (usedCount > 0) {
      throw new Error("Không thể xoá tag đang được sử dụng");
    }

    await tag.destroy();
    return true;
  },
};

module.exports = AdminTagService;
