import axios from "@/config/axios";

// GET all tags
export const getAdminTagsAPI = async () => {
  const res = await axios.get("/admin/tags");
  return res.data.tags;
};

// CREATE tag
export const createTagAPI = async (name) => {
  const res = await axios.post("/admin/tags", { name });
  return res.data.tag;
};

// DELETE tag
export const deleteTagAPI = async (id) => {
  const res = await axios.delete(`/admin/tags/${id}`);
  return res.data;
};
