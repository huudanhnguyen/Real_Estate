import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:4000/api",
  withCredentials: false,
});

// Add token vào header nếu có
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Xử lý lỗi global
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || { message: "Có lỗi xảy ra" });
  }
);

export default instance;
