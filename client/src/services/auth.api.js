const vite = import.meta.env.VITE_SERVER_URL;
import axios from "@/config/axios";

export const registerAPI = async (data) => {
  const res = await fetch(`${vite}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const loginAPI = async (data) => {
  const res = await fetch(`${vite}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const forgotPasswordAPI = async (email) => {
  const res = await axios.post("/auth/forgot-password", { email });
  return res.data;
};

export const verifyResetTokenAPI = async (token) => {
  const res = await axios.get(`/auth/verify-reset-token?token=${token}`);
  return res.data;
};

export const resetPasswordAPI = async (token, password) => {
  const res = await axios.post("/auth/reset-password", { token, password });
  return res.data;
};
