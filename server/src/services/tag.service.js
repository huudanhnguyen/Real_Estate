const { Tag } = require("@models");

const TagService = {
  // lấy toàn bộ tags
  getAllTags: async () => {
    const tags = await Tag.findAll({ order: [["id", "ASC"]] });
    return tags;
  },

  // tạo tag mới
  createTag: async (tagText) => {
    if (!tagText) throw new Error("Tag không được để trống");

    const exist = await Tag.findOne({ where: { tag: tagText } });
    if (exist) throw new Error("Tag đã tồn tại");

    return await Tag.create({ tag: tagText });
  },

  // xóa tag
  deleteTag: async (id) => {
    const tag = await Tag.findByPk(id);
    if (!tag) throw new Error("Tag không tồn tại");

    await tag.destroy();
    return true;
  },
};

module.exports = TagService;
