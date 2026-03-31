import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Tags } from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    label: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    label: "Posts",
    icon: FileText,
    path: "/admin/posts",
  },
  {
    label: "Tags",
    icon: Tags,
    path: "/admin/tags",
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 text-lg font-bold border-b">RealEstate Admin</div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                 ${
                   isActive
                     ? "bg-slate-100 text-slate-900"
                     : "text-slate-600 hover:bg-slate-100"
                 }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
