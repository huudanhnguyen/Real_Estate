const { Op } = require("sequelize");
const { Message, Conversation, User } = require("@models");
const ChatService = require("@services/chat.service");

/* =====================================================
   CREATE CONVERSATION
===================================================== */
exports.createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        message: "receiverId is required",
      });
    }

    const conversation = await ChatService.getOrCreateConversation(
      userId,
      receiverId
    );

    return res.json(conversation);
  } catch (err) {
    console.error("CREATE CONVERSATION ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =====================================================
   GET USER CONVERSATIONS
===================================================== */
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await ChatService.getUserConversations(userId);
    return res.json(conversations);
  } catch (err) {
    console.error("GET CONVERSATIONS ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =====================================================
   GET MESSAGES BY CONVERSATION
===================================================== */
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.findAll({
      where: { idConversation: conversationId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "fullName", "avatar"],
        },
      ],
    });

    return res.json(messages);
  } catch (err) {
    console.error("GET MESSAGES ERROR FULL:", err);
    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};


/* =====================================================
   SEND MESSAGE
===================================================== */
exports.sendMessage = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({
        message: "conversationId và content là bắt buộc",
      });
    }

    const message = await ChatService.sendMessage(
      conversationId,
      req.user.id,
      content,
      io
    );

    return res.json(message);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

/* =====================================================
   MARK SEEN MESSAGE
===================================================== */
exports.markSeen = async (req, res) => {
  try {
    const io = req.app.get("io");
    const userId = req.user.id;
    const { conversationId } = req.body;

    await Message.update(
      { seenAt: new Date() },
      {
        where: {
          idConversation: conversationId,
          senderId: { [Op.ne]: userId },
          seenAt: null,
        },
      }
    );

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const receiverId =
      conversation.idUser1 === userId
        ? conversation.idUser2
        : conversation.idUser1;

    io.to(`user_${receiverId}`).emit("messages_seen", {
      conversationId,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("MARK SEEN ERROR:", err);
    return res.status(500).json({ message: "Mark seen failed" });
  }
};
