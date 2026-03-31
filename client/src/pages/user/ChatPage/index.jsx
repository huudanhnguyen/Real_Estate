import { useState, useEffect } from "react";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";

const ChatPage = () => {
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    console.log("ACTIVE CONVERSATION:", activeConversation);
  }, [activeConversation]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border shadow-sm flex h-[80vh] overflow-hidden">
          <ConversationList
            activeId={activeConversation?.id}
            onSelect={setActiveConversation}
            onFirstLoad={setActiveConversation}
          />

          <ChatWindow
            conversationId={activeConversation?.id}
            receiver={activeConversation?.otherUser}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
