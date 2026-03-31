import { useEffect, useState, useRef } from "react";
import ConversationItem from "./ConversationItem";
import { getConversationsAPI } from "@/services/chat.service";

const ConversationList = ({ activeId, onSelect }) => {
  const [conversations, setConversations] = useState([]);
  const didAutoSelect = useRef(false); // 🔥 chặn auto-select nhiều lần

  useEffect(() => {
    (async () => {
      const res = await getConversationsAPI();
      const data = Array.isArray(res.data) ? res.data : [];

      setConversations(data);

      // ✅ AUTO OPEN CHAT ĐẦU TIÊN (CHỈ 1 LẦN)
      if (data.length > 0 && !didAutoSelect.current && !activeId) {
        onSelect(data[0]);
        didAutoSelect.current = true;
      }
    })();
  }, [activeId, onSelect]);

  return (
    <div className="w-[320px] border-r bg-white overflow-y-auto">
      {conversations.map((c) => (
        <ConversationItem
          key={c.id}
          conversation={c}
          active={c.id === activeId}
          onClick={() => onSelect(c)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
