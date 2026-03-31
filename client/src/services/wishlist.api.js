import axios from "@/config/axios";

export const checkWishlistAPI = async (idPost) => {
  const res = await axios.get(`/wishlist/${idPost}`);
  return !!res.data.liked;
};

export const addWishlistAPI = async (idPost) => {
  const res = await axios.post(`/wishlist/${idPost}`);
  return res.data;
};

export const removeWishlistAPI = async (idPost) => {
  const res = await axios.delete(`/wishlist/${idPost}`);
  return res.data;
};
export const getWishlistAPI = async (page = 1, limit = 20) => {
  const res = await axios.get("/wishlist", {
    params: { page, limit },
  });
  return res.data;
};