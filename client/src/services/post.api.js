import axios from "@/config/axios";

// CREATE POST
export const createPostAPI = (data) => {
  return axios.post("/posts", data);
};

// UPLOAD IMAGES
export const uploadImagesAPI = (postId, images) => {
  const formData = new FormData();
  images.forEach((item) => formData.append("images", item.file));

  return axios.post(`/upload/post-images/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET POSTS BY TYPE
export const getPostsByTypeAPI = async (listingType) => {
  const res = await axios.get("/posts", {
    params: { listingType },
  });
  return res.data.data || [];
};

// GET DETAIL
export const getPostDetailAPI = async (idPost) => {
  const res = await axios.get(`/posts/${idPost}`);
  return res.data.post;
};

// UPDATE
export const updatePostAPI = async (idPost, data) => {
  const res = await axios.put(`/posts/${idPost}`, data);
  return res.data;
};

// DELETE
export const deletePostAPI = async (idPost) => {
  const res = await axios.delete(`/posts/${idPost}`);
  return res.data;
};

// GET ALL POSTS
export const getAllPostsAPI = async (params = {}) => {
  const res = await axios.get("/posts", { params });
  return res.data.data;
};

// 🔥 GET MY POSTS (QUAN TRỌNG CHO BOOST)
export const getMyPostsAPI = async () => {
  const res = await axios.get("/users/my-posts");
  return res.data.posts;
};
