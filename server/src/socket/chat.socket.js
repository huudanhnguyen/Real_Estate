const { Conversation } = require("@models");

/**
 * Emit realtime message + notification
 */
const emitNewMessage = async (io, message) => {
  const conversation = await Conversation.findByPk(message.idConversation);
  if (!conversation) return;

  const receiverId =
    conversation.idUser1 === message.senderId
      ? conversation.idUser2
      : conversation.idUser1;

  // 📩 Realtime message
  io.to(`user_${receiverId}`).emit("new_message", {
    id: message.id,
    conversationId: message.idConversation,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
  });

  // 🔔 Notification
  io.to(`user_${receiverId}`).emit("new_notification", {
    type: "message",
    content: "Bạn có tin nhắn mới",
    conversationId: message.idConversation,
  });
};
const emitMessagesRead = async (io, conversationId, readerId) => {
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) return;

  const senderId =
    conversation.idUser1 === readerId
      ? conversation.idUser2
      : conversation.idUser1;

  io.to(`user_${senderId}`).emit("messages_read", {
    conversationId,
    readerId,
  });
};

module.exports = {
  emitNewMessage,
  emitMessagesRead,
};
