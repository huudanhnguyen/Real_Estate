const ChatHeader = ({ user }) => {
  if (!user) return null;

  return (
    <div className="h-14 border-b bg-white px-4 flex items-center gap-3">
      <img
        src={user.avatar || "https://i.pravatar.cc/40"}
        className="w-9 h-9 rounded-full object-cover"
      />
      <div className="font-semibold">{user.fullName}</div>
    </div>
  );
};

export default ChatHeader;
