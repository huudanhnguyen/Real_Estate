const { User, Post, PostImage, Transaction } = require("@models");
const bcrypt = require("bcryptjs");
const UploadService = require("@services/upload.service");

const UserService = {
  // =========================== GET PROFILE ===========================
  getProfile: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "email",
        "fullName",
        "phone",
        "avatar",
        "avatarPath",
        "balance",
        "score",
        "createdAt",
        "role",
      ],
    });

    if (!user) throw new Error("User not found");
    return user;
  },

  // ====================== GET PROFILE + WALLET =======================
  // Dùng cho BalanceManagement.jsx
  getProfileWithWallet: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "email",
        "fullName",
        "phone",
        "avatar",
        "avatarPath",
        "balance",
        "score",
        "createdAt",
        "role",
      ],
    });

    if (!user) throw new Error("User not found");

    const transactions = await Transaction.findAll({
      where: {
        idUser: userId,
      },
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    return {
      ...user.toJSON(),
      transactions,
    };
  },

  // =========================== UPDATE PROFILE ===========================
  updateProfile: async (userId, data) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const allowed = [
      "fullName",
      "phone",
      "description",
      "address",
      "province",
      "district",
      "ward",
    ];

    allowed.forEach((key) => {
      if (data[key] !== undefined) user[key] = data[key];
    });

    await user.save();
    return user;
  },

  // =========================== CHANGE PASSWORD ===========================
  changePassword: async (userId, oldPassword, newPassword) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Mật khẩu cũ không chính xác");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
  },

  // =========================== UPLOAD AVATAR ===========================
  uploadAvatar: async (userId, file) => {
    return await UploadService.uploadAvatar(userId, file);
  },

  // =========================== DELETE AVATAR ===========================
  deleteAvatar: async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    if (user.avatarPath) {
      try {
        await UploadService.deleteFile(user.avatarPath);
      } catch (err) {
        console.log("Lỗi xoá avatar:", err.message);
      }
    }

    user.avatar = null;
    user.avatarPath = null;
    await user.save();

    return true;
  },

  // =========================== USER POSTS ===========================
  getMyPosts: async (userId) => {
    return await Post.findAll({
      where: { idUser: userId },
      attributes: [
        "idPost",
        "title",
        "price",
        "status",
        "expiredDate",
        "createdAt",
      ],
      include: [
        {
          model: PostImage,
          as: "images",
          attributes: ["url"],
          limit: 1,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },
};

module.exports = UserService;
