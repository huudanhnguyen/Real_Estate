const WishlistService = require("@services/wishlist.service");

const WishlistController = {
  add: async (req, res) => {
    try {
      const userId = req.user.id;
      const { postId } = req.params;

      const saved = await WishlistService.addToWishlist(userId, postId);

      return res.status(201).json({
        message: "Đã thêm vào yêu thích",
        wishlist: saved,
      });
    } catch (err) {
      return res
        .status(400)
        .json({ message: err.message || "Lỗi khi thêm wishlist" });
    }
  },

  remove: async (req, res) => {
    try {
      const userId = req.user.id;
      const { postId } = req.params;

      const result = await WishlistService.removeFromWishlist(userId, postId);

      return res.json({ message: "Đã xoá khỏi yêu thích", result });
    } catch (err) {
      return res
        .status(400)
        .json({ message: err.message || "Lỗi khi xoá wishlist" });
    }
  },

  list: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;

      const result = await WishlistService.getUserWishlist(userId, {
        page,
        limit,
      });

      return res.json({
        message: "Lấy danh sách yêu thích thành công",
        ...result,
      });
    } catch (err) {
      return res
        .status(400)
        .json({ message: err.message || "Lỗi khi lấy wishlist" });
    }
  },
  checkWishlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const { postId } = req.params;
      const liked = await WishlistService.isInWishlist(userId, postId);

      return res.json({
        message: "Kiểm tra wishlist thành công",
        liked,
      });
    } catch (err) {
      return res
        .status(400)
        .json({ message: err.message || "Lỗi khi kiểm tra wishlist" });
    }
  },
};

module.exports = WishlistController;
