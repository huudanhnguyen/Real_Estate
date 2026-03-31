const { Conversation, Message, User } = require("@models");
const { Op } = require("sequelize");
const { emitNewMessage } = require("@socket/chat.socket");

const ChatService = {
  getOrCreateConversation: async (userId, targetUserId) => {
    if (userId === targetUserId) {
      throw new Error("Không thể chat với chính mình");
    }

    // Tìm conversation đã tồn tại
    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { idUser1: userId, idUser2: targetUserId },
          { idUser1: targetUserId, idUser2: userId },
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        idUser1: userId,
        idUser2: targetUserId,
      });
    }

    return conversation;
  },

  getUserConversations: async (userId) => {
  const conversations = await Conversation.findAll({
    where: {
      [Op.or]: [{ idUser1: userId }, { idUser2: userId }],
    },
    order: [["updatedAt", "DESC"]],
    include: [
      {
        model: User,
        as: "User1",
        attributes: ["id", "fullName", "avatar"],
      },
      {
        model: User,
        as: "User2",
        attributes: ["id", "fullName", "avatar"],
      },
      {
        model: Message,
        as: "messages",
        limit: 1,
        order: [["createdAt", "DESC"]],
      },
    ],
  });

  // map ra otherUser cho frontend
  return conversations.map((c) => {
    const otherUser =
      c.idUser1 === userId ? c.User2 : c.User1;

    return {
      id: c.id,
      otherUser,
      lastMessage: c.messages?.[0]?.content || "",
      updatedAt: c.updatedAt,
    };
  });
},

  getMessages: async (conversationId, userId) => {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) throw new Error("Conversation không tồn tại");

    if (conversation.idUser1 !== userId && conversation.idUser2 !== userId) {
      throw new Error("Bạn không có quyền xem cuộc trò chuyện này");
    }

    const messages = await Message.findAll({
      where: { idConversation: conversationId },
      order: [["createdAt", "ASC"]],
    });

    return messages;
  },

  sendMessage: async (conversationId, senderId, content, io) => {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) throw new Error("Conversation không tồn tại");
    if (
      conversation.idUser1 !== senderId &&
      conversation.idUser2 !== senderId
    ) {
      throw new Error(
        "Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này"
      );
    }
    const message = await Message.create({
      idConversation: conversationId,
      senderId,
      content,
      isRead: false,
    });
    // Cập nhật lại thời gian cập nhật của cuộc trò chuyện
    conversation.updatedAt = new Date();
    await conversation.save();
    // Phát tin nhắn mới qua socket.io
    await emitNewMessage(io, message);
    return message;
  },

  markAsRead: async (conversationId, userId, io) => {
    await Message.update(
      { isRead: true },
      {
        where: {
          idConversation: conversationId,
          senderId: { [Op.ne]: userId },
          isRead: false,
        },
      }
    );

    await emitMessagesRead(io, conversationId, userId);

    return { success: true };
  }
};

module.exports = ChatService;
