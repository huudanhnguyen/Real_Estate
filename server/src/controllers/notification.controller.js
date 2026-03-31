const NotificationService = require("@services/notification.service");

const NotificationController = {
  /**
   * Lấy danh sách notification của user hiện tại
   */
  getMyNotifications: async (req, res) => {
    try {
      const idUser = req.user.id; // lấy từ middleware auth
      const limit = Number(req.query.limit) || 10;

      const notifications = await NotificationService.getNotificationsByUser(
        idUser,
        limit
      );

      res.json(notifications);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Đếm số notification chưa đọc
   */
  countUnread: async (req, res) => {
    try {
      const idUser = req.user.id;

      const count = await NotificationService.countUnread(idUser);

      res.json({ unread: count });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Đánh dấu 1 notification là đã đọc
   */
  markAsRead: async (req, res) => {
    try {
      const idUser = req.user.id;
      const { id } = req.params;

      const notification = await NotificationService.markAsRead(id, idUser);

      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Đánh dấu tất cả notification là đã đọc
   */
  markAllAsRead: async (req, res) => {
    try {
      const idUser = req.user.id;

      await NotificationService.markAllAsRead(idUser);

      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = NotificationController;
