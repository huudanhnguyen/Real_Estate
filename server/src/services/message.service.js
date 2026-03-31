const { Message, Conversation, User } = require("@models");
const NotificationService = require("@services/notification.service");

const MessageService = {
  /**
   * Gửi message
   */
  sendMessage: async ({ idConversation, senderId, content, io }) => {
    // 1. Kiểm tra conversation
    const conversation = await Conversation.findByPk(idConversation);
    if (!conversation) throw new Error("Conversation không tồn tại");

    // 2. Kiểm tra quyền
    if (
      conversation.idUser1 !== senderId &&
      conversation.idUser2 !== senderId
    ) {
      throw new Error("Bạn không có quyền gửi tin nhắn");
    }

    // 3. Lưu message
    const message = await Message.create({
      idConversation,
      senderId,
      content,
    });

    // 4. Xác định người nhận
    const receiverId =
      conversation.idUser1 === senderId
        ? conversation.idUser2
        : conversation.idUser1;

    // ❌ Không tự notify chính mình
    if (receiverId === senderId) return message;

    // 5. Lấy info sender
    const sender = await User.findByPk(senderId);

    // 6. Tạo notification
    const notification = await NotificationService.createNotification({
      idUser: receiverId,
      type: "message",
      title: "Tin nhắn mới",
      content: `${sender.fullName} đã gửi cho bạn một tin nhắn`,
      link: `/messages/${conversation.id}`,
    });

    // 7. Emit realtime message
    io.to(`user_${receiverId}`).emit("new_message", {
      id: message.id,
      conversationId: message.idConversation,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
    });

    // 8. Emit realtime notification
    io.to(`user_${receiverId}`).emit("new_notification", {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      link: notification.link,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    });

    return message;
  },
};

module.exports = MessageService;
