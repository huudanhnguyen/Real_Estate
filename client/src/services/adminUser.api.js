import axios from "@/config/axios";

export const getAdminUsersAPI = async (params) => {
  const res = await axios.get("/admin/users", { params });
  return res.data; // { data, pagination }
};

export const updateUserRoleAPI = async (id, role) => {
  const res = await axios.patch(`/admin/users/${id}/role`, { role });
  return res.data; // { role }
};

export const toggleUserLockAPI = async (id) => {
  const res = await axios.patch(`/admin/users/${id}/lock`);
  return res.data; // { isLocked }
};
