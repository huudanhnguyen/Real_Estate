import { useEffect, useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getMyProfileAPI, getMyPostsAPI } from "@/services/user.api";
import BoostModal from "@/components/BoostModal";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleOpenBoost = (post) => {
    setSelectedPost(post);
    setOpenModal(true);
  };

  const fetchData = async () => {
    try {
      setLoadingProfile(true);
      setLoadingPosts(true);

      const [profileRes, postsRes] = await Promise.all([
        getMyProfileAPI(),
        getMyPostsAPI(),
      ]);

      setProfile(profileRes);
      setPosts(postsRes.posts || postsRes || []);
    } catch (err) {
      console.error("Error load dashboard:", err);
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoadingProfile(false);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalActive = posts.filter((p) => p.status === "approved").length;
  const totalPending = posts.filter((p) => p.status === "pending").length;
  const totalRejected = posts.filter((p) => p.status === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Header */}{" "}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
            Trang người bán{" "}
          </h1>{" "}
          <p className="text-sm text-slate-500 mt-1">
            Quản lý tin đăng, số dư và hiệu quả bán hàng của bạn.{" "}
          </p>{" "}
        </div>{" "}
        <Link to="/create-post">
          {" "}
          <Button className="gap-2 rounded-xl">
            {" "}
            <PlusCircle className="w-4 h-4" />
            Đăng tin mới{" "}
          </Button>{" "}
        </Link>{" "}
      </div>
      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Số dư"
          value={
            profile ? profile.balance?.toLocaleString("vi-VN") + " đ" : "--"
          }
          loading={loadingProfile}
        />
        <StatCard
          title="Điểm uy tín"
          value={profile ? profile.score || 0 : "--"}
          loading={loadingProfile}
        />
        <StatCard
          title="Tin đang hiển thị"
          value={totalActive}
          loading={loadingPosts}
        />
        <StatCard
          title="Tin chờ duyệt"
          value={totalPending}
          loading={loadingPosts}
        />
      </section>
      {/* Posts */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Tin đăng mới nhất
          </h2>

          <p className="text-xs text-slate-500">
            Tổng: {posts.length} | Đã duyệt: {totalActive} | Chờ: {totalPending}{" "}
            | Từ chối: {totalRejected}
          </p>
        </div>

        {loadingPosts ? (
          <div className="flex items-center justify-center py-10 text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang tải danh sách tin...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm border rounded-2xl bg-white">
            Bạn chưa có tin đăng nào. Hãy bắt đầu bằng cách{" "}
            <span className="font-semibold">đăng tin mới</span>.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostItem
                key={post.idPost || post.id}
                post={post}
                onBoost={handleOpenBoost}
              />
            ))}
          </div>
        )}
      </section>
      <BoostModal
        open={openModal}
        postId={selectedPost?.idPost}
        onClose={() => setOpenModal(false)}
        user={profile}
        onSuccess={fetchData}
        isBoosted={selectedPost?.isBoosted}
      />
    </div>
  );
}

/* ---------------------- COMPONENTS -------------------------------- */

function StatCard({ title, value, loading }) {
  return (
    <Card className="rounded-2xl border bg-white">
      {" "}
      <CardHeader className="pb-2">
        {" "}
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {title}{" "}
        </p>{" "}
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
        ) : (
          <p className="text-xl font-semibold text-slate-800">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

function PostItem({ post, onBoost }) {
  const img = post.images?.[0]?.url || null;

  const isBoosted =
    post.isBoosted ||
    (post.boostExpiredAt && new Date(post.boostExpiredAt) > new Date());

  const statusColor =
    post.status === "approved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : post.status === "pending"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : post.status === "rejected"
          ? "bg-rose-50 text-rose-700 border-rose-100"
          : "bg-slate-50 text-slate-700 border-slate-100";

  const statusLabel =
    post.status === "approved"
      ? "Đang hiển thị"
      : post.status === "pending"
        ? "Chờ duyệt"
        : post.status === "rejected"
          ? "Bị từ chối"
          : post.status;

  return (
    <Card className="rounded-2xl border bg-white overflow-hidden">
      {" "}
      <div className="flex gap-4 p-4">
        {" "}
        <div className="w-28 h-20 sm:w-40 sm:h-32 bg-slate-100 rounded-lg overflow-hidden">
          {img ? (
            <img src={img} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-400">
              Không có ảnh{" "}
            </div>
          )}{" "}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold line-clamp-2">{post.title}</h3>

            <span
              className={`text-xs px-2 py-1 rounded-full border ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>

          <p className="text-emerald-700 font-semibold">
            {post.price
              ? post.price.toLocaleString("vi-VN") + " đ"
              : "Giá thỏa thuận"}
          </p>

          {isBoosted && (
            <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-yellow-700">🔥 Đang boost</div>

              <div>📦 Gói: {post.pricingName || "Gói Boost"}</div>

              <div>⏳ Còn {Math.max(post.daysLeft || 0, 0)} ngày</div>

              {post.boostExpiredAt && (
                <div>
                  📅 Hết hạn:{" "}
                  {new Date(post.boostExpiredAt).toLocaleDateString("vi-VN")}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline">
              Chỉnh sửa
            </Button>

            <Button
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => onBoost(post)}
            >
              {isBoosted ? "Gia hạn Boost" : "Boost bài đăng"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
