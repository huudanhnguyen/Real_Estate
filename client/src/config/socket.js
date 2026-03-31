import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // chỉ connect khi đã login
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
  }

  if (userId) {
    socket.emit("join", userId);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
