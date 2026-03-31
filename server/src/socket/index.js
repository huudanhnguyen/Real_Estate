module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // User join room theo userId
    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined room user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  // Load chat socket
  require("./chat.socket")(io);
};
