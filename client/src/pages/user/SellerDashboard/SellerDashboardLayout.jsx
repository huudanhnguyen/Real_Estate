import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, FileText, User, Wallet, BarChart2, LogOut } from "lucide-react";

import { getMyProfileAPI } from "@/services/user.api";

export default function SellerDashboardLayout() {
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function load() {
      const res = await getMyProfileAPI();
      setProfile(res);
    }
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-72 bg-white border-r shadow-sm flex-col flex-shrink-0">
        <div className="p-6 border-b flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {profile?.avatar ? (
              <AvatarImage src={profile.avatar} />
            ) : (
              <AvatarFallback>
                {profile?.fullName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>

          <div>
            <p className="font-semibold text-slate-800">
              {profile?.fullName || "Người bán"}
            </p>
            <p className="text-xs text-slate-500">
              Tham gia:{" "}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
                : "--"}
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-1 text-sm">
          <SidebarItem icon={Home} label="Trang chủ" href="/seller/dashboard" />
          <SidebarItem
            icon={FileText}
            label="Tin đăng của tôi"
            href="/seller/posts"
          />
          <SidebarItem
            icon={User}
            label="Quản lý tài khoản"
            href="/seller/account"
          />
          <SidebarItem
            icon={Wallet}
            label="Quản lý số dư"
            href="/seller/balance"
          />
          <SidebarItem
            icon={BarChart2}
            label="Báo cáo & thống kê"
            href="/seller/reports"
          />
        </nav>
      </aside>

      {/* MOBILE MENU */}
      <div className="md:hidden bg-white border-b shadow-sm px-3 py-4 sticky top-0 z-40 space-y-3">
        {/* HÀNG 1 */}
        <div className="grid grid-cols-3 gap-2">
          <MobileItem icon={Home} label="Trang chủ" href="/seller/dashboard" />
          <MobileItem icon={FileText} label="Tin đăng" href="/seller/posts" />
          <MobileItem icon={User} label="Tài khoản" href="/seller/account" />
        </div>

        {/* HÀNG 2 */}
        <div className="grid grid-cols-2 gap-2">
          <MobileItem icon={Wallet} label="Số dư" href="/seller/balance" />
          <MobileItem
            icon={BarChart2}
            label="Thống kê"
            href="/seller/reports"
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full px-4 py-6 md:px-8 md:py-8">
        <div className="w-full max-w-[900px] mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, href }) {
  const { pathname } = useLocation();
  const active = pathname === href;

  return (
    <Link
      to={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        active
          ? "bg-emerald-50 text-emerald-700 font-medium"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

function MobileItem({ icon: Icon, label, href }) {
  const { pathname } = useLocation();
  const active = pathname === href;

  return (
    <Link
      to={href}
      className={`flex items-center gap-1 px-3 py-2 text-sm rounded-xl border whitespace-nowrap ${
        active
          ? "bg-emerald-600 text-white border-emerald-600"
          : "bg-white text-slate-600"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
