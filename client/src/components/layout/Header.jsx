import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Menu,
  X,
  User,
  LogOut,
  PlusCircle,
  Bell,
  MessageCircle,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/auth.context";

// shadcn UI
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMyProfileAPI } from "@/services/user.api";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    user,
    logout,
    unreadMessages,
    setUnreadMessages,
    unreadNoti,
    setUnreadNoti,
  } = useAuth();

  const isAdmin = user?.role === "admin";

  // Avatar riêng cho header
  const [avatarUrl, setAvatarUrl] = useState("");

  /* ================= LOAD AVATAR ================= */
  useEffect(() => {
    const loadAvatar = async () => {
      if (!user) return;
      try {
        const res = await getMyProfileAPI();
        setAvatarUrl(res.avatar || "");
      } catch (err) {
        console.error("Load avatar header failed:", err);
      }
    };

    loadAvatar();
  }, [user]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* ================= HEADER DESKTOP ================= */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-red-600">
            Batdongsan
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <Link to="/nha-dat-ban" className="hover:text-red-600">
              Nhà đất bán
            </Link>
            <Link to="/nha-dat-cho-thue" className="hover:text-red-600">
              Nhà đất cho thuê
            </Link>
            <Link to="/du-an" className="hover:text-red-600">
              Dự án
            </Link>
            <Link to="/tin-tuc" className="hover:text-red-600">
              Tin tức
            </Link>
          </nav>

          {/* ================= ACTIONS ================= */}
          <div className="hidden md:flex items-center gap-3">
            {/* 💬 Messages */}
            <button
              onClick={() => {
                if (!user) return navigate("/login");
                setUnreadMessages(0);
                localStorage.setItem("unreadMessages", 0);
                navigate("/messages");
              }}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <MessageCircle size={20} />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>

            {/* 🔔 Notifications */}
            <button
              onClick={() => {
                setUnreadNoti(0);
                localStorage.setItem("unreadNoti", 0);
                navigate("/notifications");
              }}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <Bell size={20} />
              {unreadNoti > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadNoti}
                </span>
              )}
            </button>

            {/* ❤️ Wishlist */}
            <button
              onClick={() => {
                if (!user) return navigate("/login");
                navigate("/wishlist");
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart size={20} />
            </button>

            {/* ===== AUTH ===== */}
            {!user && (
              <>
                <Link to="/login" className="hover:text-red-600">
                  Đăng nhập
                </Link>
                <Link to="/register" className="hover:text-red-600">
                  Đăng ký
                </Link>
              </>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-red-600 text-white">
                      {user.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.fullName}</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  {/* 👑 ADMIN */}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem
                        onClick={() => window.open("/admin", "_blank")}
                      >
                        <Shield size={16} className="mr-2 text-red-600" />
                        Trang quản trị
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* 👤 SELLER (ẨN NẾU ADMIN) */}
                  {!isAdmin && (
                    <DropdownMenuItem
                      onClick={() => navigate("/seller/dashboard")}
                    >
                      <User size={16} className="mr-2" />
                      Trang người bán
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                    <Heart size={16} className="mr-2" />
                    Tin đã lưu
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* ➕ Đăng tin (ẨN NẾU ADMIN) */}
            {!isAdmin && (
              <Link
                to={user ? "/create-post" : "/login"}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Đăng tin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* ================= MOBILE SIDEBAR ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-[260px] h-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="p-2 mb-4 hover:bg-gray-100 rounded-lg"
            >
              <X size={22} />
            </button>

            {user && (
              <div className="flex items-center gap-3 mb-5">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="bg-red-600 text-white">
                    {user.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-4 font-medium">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="text-red-600 font-semibold"
                >
                  👑 Trang quản trị
                </Link>
              )}

              <Link to="/messages" onClick={() => setOpen(false)}>
                💬 Tin nhắn
              </Link>
              <Link to="/notifications" onClick={() => setOpen(false)}>
                🔔 Thông báo
              </Link>

              <hr />

              <Link to="/nha-dat-ban" onClick={() => setOpen(false)}>
                Nhà đất bán
              </Link>
              <Link to="/nha-dat-cho-thue" onClick={() => setOpen(false)}>
                Nhà đất cho thuê
              </Link>
              <Link to="/du-an" onClick={() => setOpen(false)}>
                Dự án
              </Link>
              <Link to="/tin-tuc" onClick={() => setOpen(false)}>
                Tin tức
              </Link>

              <hr />

              {user ? (
                <>
                  {!isAdmin && (
                    <Link to="/seller/dashboard" onClick={() => setOpen(false)}>
                      Trang người bán
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="text-left text-red-600"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Đăng nhập
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    Đăng ký
                  </Link>
                </>
              )}

              {!isAdmin && (
                <Link
                  to={user ? "/create-post" : "/login"}
                  onClick={() => setOpen(false)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-center"
                >
                  Đăng tin
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
