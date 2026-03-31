const vite = import.meta.env.VITE_SERVER_URL;
import axios from "@/config/axios";

// ================================
// USERS MANAGEMENT
// ================================

// Get all users
export const getAllUsersAPI = async () => {
  const res = await axios.get("/admin/users");
  return res.data;
};

// Get user detail
export const getUserDetailAdminAPI = async (id) => {
  const res = await axios.get(`/admin/users/${id}`);
  return res.data;
};

// Update user role
export const updateUserRoleAPI = async (id, role) => {
  const res = await axios.patch(`/admin/users/${id}/role`, { role });
  return res.data;
};

// Delete user
export const deleteUserAdminAPI = async (id) => {
  const res = await axios.delete(`/admin/users/${id}`);
  return res.data;
};

// Upload avatar for user (admin)
export const uploadUserAvatarAdminAPI = async (id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axios.patch(`/admin/users/${id}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// ================================
// POSTS MANAGEMENT
// ================================

// Get all posts
export const getAllPostsAdminAPI = async () => {
  const res = await axios.get("/admin/posts");
  return res.data;
};

// Get post detail
export const getPostDetailAdminAPI = async (idPost) => {
  const res = await axios.get(`/admin/posts/${idPost}`);
  return res.data;
};

// Update post status (approve / reject / pending / sold)
export const updatePostStatusAPI = async (idPost, status) => {
  const res = await axios.patch(`/admin/posts/${idPost}/status`, { status });
  return res.data;
};

// Delete post
export const deletePostAdminAPI = async (idPost) => {
  const res = await axios.delete(`/admin/posts/${idPost}`);
  return res.data;
};
