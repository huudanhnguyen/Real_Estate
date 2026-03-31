const { Wishlist, Post } = require("@models");

const WishlistService = {
  addToWishlist: async (userId, postId) => {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Bài đăng không tồn tại");

    const exist = await Wishlist.findOne({
      where: { idUser: userId, idPost: postId },
    });
    if (exist) return exist;

    const created = await Wishlist.create({ idUser: userId, idPost: postId });
    return created;
  },

  removeFromWishlist: async (userId, postId) => {
    const record = await Wishlist.findOne({
      where: { idUser: userId, idPost: postId },
    });
    if (!record) throw new Error("Không tìm thấy mục yêu thích");

    await record.destroy();
    return { deleted: true };
  },

  getUserWishlist: async (userId, { page = 1, limit = 20 } = {}) => {
    const offset = (page - 1) * limit;

    const { rows, count } = await Wishlist.findAndCountAll({
      where: { idUser: userId },
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Post,
          include: [{ model: require("@models").PostImage, as: "images" }],
        },
      ],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  },
  isInWishlist: async (userId, postId) => {
    const record = await Wishlist.findOne({
      where: { idUser: userId, idPost: postId },
    });
    return !!record;
  },
};

module.exports = WishlistService;
