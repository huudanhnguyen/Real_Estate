import { useNavigate } from "react-router-dom";
import { LogOut, UserCog } from "lucide-react";
import { useAuth } from "@/context/auth.context";

// shadcn/ui
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* LEFT */}
      <h1 className="font-semibold text-lg">RealEstate Admin</h1>

      {/* RIGHT */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.fullName?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>

            <div className="text-sm text-right hidden md:block">
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-slate-500">Admin</p>
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate("/admin/account")}>
            <UserCog className="w-4 h-4 mr-2" />
            Tài khoản
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
