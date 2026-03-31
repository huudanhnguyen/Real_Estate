import { useState } from "react";
import { SendHorizonal } from "lucide-react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="h-16 px-4 border-t bg-white flex items-center gap-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Nhập tin nhắn..."
        className="flex-1 h-10 px-4 rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={send}
        className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
      >
        ➤
      </button>
    </div>
  );
};



export default ChatInput;
