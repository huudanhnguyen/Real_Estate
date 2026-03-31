const ConversationItem = ({ conversation, active, onClick }) => {
  const user = conversation.otherUser;

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 flex items-center gap-3 cursor-pointer
        ${active ? "bg-slate-100" : "hover:bg-slate-50"}`}
    >
      <img
        src={user?.avatar || "https://i.pravatar.cc/40"}
        className="w-10 h-10 rounded-full object-cover"
        alt={user?.fullName}
      />

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">
          {user?.fullName || "Người dùng"}
        </div>
        <div className="text-xs text-slate-500 truncate">
          {conversation.lastMessage || "Chưa có tin nhắn"}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
