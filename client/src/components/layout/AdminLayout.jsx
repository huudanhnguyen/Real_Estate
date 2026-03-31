import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <AdminHeader />

        {/* CONTENT */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-2xl border p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
