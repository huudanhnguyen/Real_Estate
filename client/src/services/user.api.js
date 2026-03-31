import axios from "@/config/axios";

export const getMyProfileAPI = async () => {
  const res = await axios.get("/users/me");
  return res.data;
};

export const updateProfileAPI = async (data) => {
  const res = await axios.put("/users/update", data);
  return res.data;
};

export const updateAvatarAPI = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axios.put("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const deleteAvatarAPI = async () => {
  const res = await axios.delete("/users/avatar");
  return res.data;
};

export const changePasswordAPI = async (oldPassword, newPassword) => {
  const res = await axios.patch("/users/change-password", {
    oldPassword,
    newPassword,
  });

  return res.data;
};
export const getMyPostsAPI = async () => {
  const res = await axios.get("/users/my-posts");
  return res.data;
};
export const topupAPI = async (amount) => {
  const res = await axios.post("/wallets/topup", { amount });
  return res.data;
};

export const confirmTopupAPI = (transactionId) => {
  return axios.post("/wallets/topup/confirm", { transactionId });
};