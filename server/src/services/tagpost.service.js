const { TagPost, Tag } = require("@models");

const TagPostService = {
  // gắn nhiều tag vào post
  addTagsToPost: async (postId, tagIds = []) => {
    await TagPost.destroy({ where: { idPost: postId } });

    const records = tagIds.map((tagId) => ({
      idPost: postId,
      idTag: tagId,
    }));

    if (records.length > 0) {
      await TagPost.bulkCreate(records);
    }
  },

  // lấy tag theo post
  getTagsByPost: async (postId) => {
    const data = await TagPost.findAll({
      where: { idPost: postId },
      include: [{ model: Tag, attributes: ["id", "tag"] }],
    });

    return data.map((item) => item.Tag);
  },

  // thêm 1 tag
  addTag: async (postId, tagId) => {
    return await TagPost.create({ idPost: postId, idTag: tagId });
  },

  // xóa 1 tag
  removeTag: async (postId, tagId) => {
    return await TagPost.destroy({ where: { idPost: postId, idTag: tagId } });
  },
};

module.exports = TagPostService;
