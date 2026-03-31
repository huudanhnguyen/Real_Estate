const MessageBubble = ({ message, isMe }) => {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}>
      <div className="flex flex-col items-end max-w-[70%]">
        <div
          className={`
            px-4 py-2 rounded-2xl text-sm
            ${isMe ? "bg-blue-500 text-white" : "bg-white border"}
          `}
        >
          {message.content}
        </div>

        {isMe && (
          <div className="text-[11px] mt-1 text-slate-400">
            {message.seenAt ? "✓✓ Đã xem" : "✓ Đã gửi"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
