import axios from "@/config/axios";
const vite = import.meta.env.VITE_SERVER_URL;

export const getAllTagsAPI = async () => {
  return axios.get(`${vite}/tags`);
};