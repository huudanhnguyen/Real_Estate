import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import {
  getMessagesAPI,
  sendMessageAPI,
  markSeenAPI,
} from "@/services/chat.service";
import { socket } from "@/config/socket";
import { useAuth } from "@/context/auth.context";

const ChatWindow = ({ conversationId, receiver }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  /* ================= OPTIMISTIC MESSAGE ================= */
  const createOptimisticMessage = (text) => ({
    id: `temp-${Date.now()}`,
    clientTempId: Date.now(),
    content: text,
    senderId: user.id,
    conversationId,
    pending: true,
    createdAt: new Date().toISOString(),
  });

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
    if (!conversationId) return;

    (async () => {
      const res = await getMessagesAPI(conversationId);
      const list = Array.isArray(res.data) ? res.data : [];
      setMessages(list);

      // ✅ Khi mở chat → đánh dấu đã xem
      if (list.length > 0) {
        markSeenAPI(conversationId);
      }
    })();

    socket.emit("join_conversation", conversationId);
  }, [conversationId]);

  /* ================= REALTIME MESSAGE ================= */
  useEffect(() => {
    const onNewMessage = (msg) => {
      if (msg.conversationId !== conversationId) return;

      setMessages((prev) => {
        const exists = prev.some(
          (m) => m.id === msg.id || m.clientTempId === msg.clientTempId
        );
        return exists ? prev : [...prev, msg];
      });

      // ✅ Người nhận đang mở chat → mark seen ngay
      if (msg.senderId !== user.id) {
        markSeenAPI(conversationId);
      }
    };

    socket.on("new_message", onNewMessage);
    return () => socket.off("new_message", onNewMessage);
  }, [conversationId, user?.id]);

  /* ================= REALTIME SEEN ================= */
  useEffect(() => {
    const onMessagesSeen = ({ conversationId: cid }) => {
      if (cid !== conversationId) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === user.id
            ? { ...m, seenAt: new Date().toISOString() }
            : m
        )
      );
    };

    socket.on("messages_seen", onMessagesSeen);
    return () => socket.off("messages_seen", onMessagesSeen);
  }, [conversationId, user?.id]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async (text) => {
    const tempMsg = createOptimisticMessage(text);
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await sendMessageAPI({
        conversationId,
        content: text,
        clientTempId: tempMsg.clientTempId,
      });

      const realMsg = res.data;

      setMessages((prev) =>
        prev.map((m) => (m.clientTempId === tempMsg.clientTempId ? realMsg : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.clientTempId === tempMsg.clientTempId ? { ...m, error: true } : m
        )
      );
    }
  };

  /* ================= EMPTY STATE ================= */
  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Chọn một cuộc trò chuyện
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <ChatHeader user={receiver} />
      <MessageList messages={messages} myId={user?.id} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
