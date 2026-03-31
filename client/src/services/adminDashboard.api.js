import axios from "@/config/axios";

export const getAdminDashboardAPI = async () => {
  const res = await axios.get("/admin/dashboard");
  return res.data;
};
