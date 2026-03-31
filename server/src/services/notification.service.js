const { Notification, User } = require("@models");

const NotificationService = {
  /**
   * Tạo notification mới
   * @param {Object} payload
   * @param {number} payload.idUser - người nhận
   * @param {string} payload.type - message | comment | reply | wishlist | system
   * @param {string} payload.title - tiêu đề
   * @param {string} payload.content - nội dung hiển thị
   * @param {string} [payload.link] - link frontend
   */
  createNotification: async ({ idUser, type, title, content, link = null }) => {
    if (!idUser || !type || !title || !content) {
      throw new Error("Thiếu dữ liệu tạo notification");
    }

    const notification = await Notification.create({
      idUser,
      type,
      title,
      content,
      link,
      isRead: false,
    });

    return notification;
  },

  /**
   * Lấy danh sách notification của user
   */
  getNotificationsByUser: async (idUser, limit = 10) => {
    return await Notification.findAll({
      where: { idUser },
      order: [["createdAt", "DESC"]],
      limit,
    });
  },

  /**
   * Đếm notification chưa đọc
   */
  countUnread: async (idUser) => {
    return await Notification.count({
      where: {
        idUser,
        isRead: false,
      },
    });
  },

  /**
   * Đánh dấu đã đọc 1 notification
   */
  markAsRead: async (idNotification, idUser) => {
    const notification = await Notification.findOne({
      where: {
        id: idNotification,
        idUser,
      },
    });

    if (!notification) {
      throw new Error("Notification không tồn tại");
    }

    notification.isRead = true;
    await notification.save();

    return notification;
  },

  /**
   * Đánh dấu đọc tất cả
   */
  markAllAsRead: async (idUser) => {
    await Notification.update(
      { isRead: true },
      {
        where: {
          idUser,
          isRead: false,
        },
      }
    );

    return true;
  },
};

module.exports = NotificationService;
