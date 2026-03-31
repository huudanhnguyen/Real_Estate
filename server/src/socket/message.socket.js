const MessageService = require("@services/message.service");

module.exports = (io) => {
  io.on("connection", (socket) => {
    // Client gửi message
    socket.on("send_message", async (data) => {
      try {
        const { idConversation, senderId, content } = data;

        await MessageService.sendMessage({
          idConversation,
          senderId,
          content,
          io,
        });
      } catch (error) {
        socket.emit("error_message", error.message);
      }
    });
  });
};
