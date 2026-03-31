const { User } = require("@models");
const UploadService = require("@services/upload.service");

const AdminService = {
  getUsers: async ({ page = 1, limit = 10, search = "" }) => {
    const offset = (page - 1) * limit;

    const where = search
      ? {
          [Op.or]: [
            { fullName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: [
        "id",
        "email",
        "fullName",
        "phone",
        "avatar",
        "role",
        "isLocked",
        "score",
        "balance",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset: Number(offset),
    });

    return {
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  getUserDetail: async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User không tồn tại");
    return user;
  },

  updateUserRole: async (id, role, adminId) => {
    if (!["user", "seller", "admin"].includes(role)) {
      throw new Error("Role không hợp lệ");
    }

    const user = await User.findByPk(id);
    if (!user) throw new Error("User không tồn tại");

    if (user.role === "admin") {
      throw new Error("Không thể thay đổi role của tài khoản admin");
    }

    if (adminId && user.id === adminId) {
      throw new Error("Không thể thay đổi role của chính mình");
    }
    user.role = role;
    await user.save();
    return user;
  },

  updateUserAvatar: async (id, file) => {
    if (!file) throw new Error("Không có file upload");

    const user = await User.findByPk(id);
    if (!user) throw new Error("User không tồn tại");

    if (user.avatar) {
      await UploadService.deleteFileByUrl(user.avatar);
    }

    const avatar = await UploadService.uploadAvatar(id, file);
    user.avatar = avatar;
    await user.save();

    return avatar;
  },

  deleteUser: async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User không tồn tại");

    await user.destroy();
    return true;
  },
  // TOGGLE LOCK / UNLOCK USER
  toggleUserLock: async (id, adminId) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User không tồn tại");

    // ❌ Không cho khoá admin
    if (user.role === "admin") {
      throw new Error("Không thể khoá tài khoản admin");
    }

    // ❌ Không cho tự khoá chính mình
    if (adminId && user.id === adminId) {
      throw new Error("Không thể tự khoá chính mình");
    }

    const isLocked = !user.isLocked;

    await user.update({
      isLocked,
      lockedAt: isLocked ? new Date() : null,
      lockReason: isLocked ? "Khoá bởi admin" : null,
    });

    return {
      id: user.id,
      isLocked: user.isLocked,
    };
  },

  // LOCK USER
  // lockUser: async (id, reason) => {
  //   const user = await User.findByPk(id);
  //   if (!user) throw new Error("User không tồn tại");

  //   if (user.role === "admin") {
  //     throw new Error("Không thể khoá tài khoản admin");
  //   }

  //   if (user.isLocked) {
  //     throw new Error("User đã bị khoá trước đó");
  //   }

  //   await user.update({
  //     isLocked: true,
  //     lockedAt: new Date(),
  //     lockReason: reason || "Vi phạm chính sách",
  //   });

  //   return user;
  // },

  // // UNLOCK USER
  // unlockUser: async (id) => {
  //   const user = await User.findByPk(id);
  //   if (!user) throw new Error("User không tồn tại");

  //   if (!user.isLocked) {
  //     throw new Error("User chưa bị khoá");
  //   }

  //   await user.update({
  //     isLocked: false,
  //     lockedAt: null,
  //     lockReason: null,
  //   });

  //   return user;
  // },
};

module.exports = AdminService;
