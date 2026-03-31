import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import RequireAdmin from "@/routes/RequireAdmin";

/* ================= USER PAGES ================= */
import Home from "@/pages/user/Home";
import SaleListingPage from "@/pages/user/SaleListingPage";
import RentListingPage from "@/pages/user/RentListingPage";
import LoginPage from "@/pages/user/LoginPage";
import RegisterPage from "@/pages/user/RegisterPage";
import PostDetailPage from "@/pages/user/PostDetailPage";
import LoginSuccess from "@/pages/user/LoginSuccess";
import ForgotPassword from "@/pages/user/ForgotPassword";
import ResetPassword from "@/pages/user/ResetPassword";
import CreatePostPage from "@/pages/user/CreatePost";
import WishlistPage from "@/pages/user/WistListPage";
import ChatPage from "@/pages/user/ChatPage";
import EditPostPage from "@/pages/user/EditPostPage";

/* ================= SELLER DASHBOARD ================= */
import SellerDashboardLayout from "@/pages/user/SellerDashboard/SellerDashboardLayout";
import SellerDashboard from "@/pages/user/SellerDashboard/SellerDashboard";
import MyPosts from "@/pages/user/SellerDashboard/MyPosts";
import AccountManagement from "@/pages/user/SellerDashboard/AccountManagement";
import BalanceManagement from "@/pages/user/SellerDashboard/BalanceManagement";
import ReportStats from "@/pages/user/SellerDashboard/ReportStats";
import PaymentResult from "@/pages/user/SellerDashboard/PaymentResult";


/* ================= ADMIN ================= */
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminPosts from "@/pages/admin/Posts";
import AdminTags from "@/pages/admin/Tags";
import AdminAccount from "@/pages/admin/Account";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= USER LAYOUT ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/nha-dat-ban" element={<SaleListingPage />} />
        <Route path="/nha-dat-cho-thue" element={<RentListingPage />} />

        <Route path="/du-an" element={<div>Trang dự án</div>} />
        <Route path="/tin-tuc" element={<div>Trang tin tức</div>} />

        <Route path="/post/:id" element={<PostDetailPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/edit-post/:id" element={<EditPostPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/messages" element={<ChatPage />} />

        {/* ================= SELLER DASHBOARD ================= */}
        <Route path="/seller" element={<SellerDashboardLayout />}>
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="posts" element={<MyPosts />} />
          <Route path="account" element={<AccountManagement />} />
          <Route path="balance" element={<BalanceManagement />} />
          <Route path="reports" element={<ReportStats />} />
          <Route path="payment-result" element={<PaymentResult />} />
        </Route>
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="account" element={<AdminAccount />} />
      </Route>
    </Routes>
  );
}
