// src/routes/chat.route.js
const express = require("express");
const verifyToken = require("@middlewares/auth.middleware");
const ChatController = require("@controllers/chat.controller");

const router = express.Router();

// Create or get conversation
router.post("/conversations", verifyToken, (req, res) =>
  ChatController.createConversation(req, res)
);

// List user conversations
router.get("/conversations", verifyToken, (req, res) =>
  ChatController.getConversations(req, res)
);

// Get messages of a conversation
router.get("/messages/:conversationId", verifyToken, (req, res) =>
  ChatController.getMessages(req, res)
);

// Send message
router.post("/messages", verifyToken, (req, res) =>
  ChatController.sendMessage(req, res)
);

// Mark messages as read
router.post("/messages/seen", verifyToken, (req, res) =>
  ChatController.markSeen(req, res)
);

module.exports = router;
