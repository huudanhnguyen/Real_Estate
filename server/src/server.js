require("module-alias/register");
require("dotenv").config({ debug: false });

const app = require("./app");
const { testConnection } = require("@config/database");
const { sequelize } = require("@models");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

async function startServer() {
  try {
    await testConnection();

    await sequelize.sync({ alter: false });
    console.log("📌 Sequelize sync an toàn!");
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
      },
    });
    app.set("io", io);
    io.on("connection", (socket) => { 
      console.log("🔌 Người dùng đã kết nối:", socket.id);
      socket.on("disconnect", () => {
        console.log("❌ Người dùng đã ngắt kết nối:", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
  }
}

startServer();
