import axios from "@/config/axios";

export const getConversationsAPI = () => {
  return axios.get("chat/conversations");
};

export const getOrCreateConversationAPI = (receiverId) => {
  return axios.post("chat/conversations", {
    receiverId,
  });
};

export const getConversationDetailAPI = (conversationId) => {
  return axios.get(`chat/conversations/${conversationId}`);
};

export const getMessagesAPI = (conversationId) => {
  return axios.get(`chat/messages/${conversationId}`);
};


export const sendMessageAPI = ({ conversationId, content }) => {
  return axios.post("chat/messages", {
    conversationId,
    content,
  });
};
export const markSeenAPI = (conversationId) => {
  return axios.post("/chat/messages/seen", { conversationId });
};

