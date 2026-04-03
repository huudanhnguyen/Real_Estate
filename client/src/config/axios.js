import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:4000/api",
  withCredentials: true,
});
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || { message: "Có lỗi xảy ra" });
  },
);

export default instance;
