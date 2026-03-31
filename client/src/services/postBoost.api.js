import axios from "@/config/axios";

export const renewBoostAPI = (postId) => {
  return axios.post(`/boost/posts/${postId}/boost/renew`);
};

export const boostPostAPI = (postId, pricingId) => {
  return axios.post(`/boost/posts/${postId}/boost`, {
    pricingId,
  });
};
