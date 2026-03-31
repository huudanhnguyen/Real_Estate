import axios from "@/config/axios";

export const getAdminPostsAPI = async (params) => {
  const res = await axios.get("/admin/posts", { params });
  return res.data;
};


// APPROVE post
export const approvePostAPI = async (idPost) => {
  const res = await axios.patch(`/admin/posts/${idPost}/approve`);
  return res.data.post;
};

// REJECT post
export const rejectPostAPI = async (idPost, reason) => {
  const res = await axios.patch(`/admin/posts/${idPost}/reject`, {
    reason,
  });
  return res.data.post;
};
// GET post detail
export const getPostDetailAPI = async (idPost) => {
  const res = await axios.get(`/posts/${idPost}`);
  return res.data.post;
};

// DELETE post
export const deletePostAPI = async (idPost) => {
  const res = await axios.delete(`/admin/posts/${idPost}`);
  return res.data;
};
