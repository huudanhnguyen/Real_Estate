import { useEffect, useState } from "react";
import { getAdminDashboardAPI } from "@/services/adminDashboard.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboardAPI();

      setStats([
        { label: "Total Users", value: data.totalUsers },
        { label: "Total Posts", value: data.totalPosts },
        { label: "Pending Posts", value: data.pendingPosts },
        { label: "Approved Posts", value: data.approvedPosts },
      ]);
    } catch (err) {
      alert(err.response?.data?.message || "Load dashboard failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}

      {!loading && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div key={item.label} className="border rounded-2xl p-6 bg-white">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-2xl font-bold mt-2">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
