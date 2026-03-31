import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, myId }) => {
  const bottomRef = useRef(null);
  const safeMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      {safeMessages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isMe={msg.senderId === myId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};


export default MessageList;
