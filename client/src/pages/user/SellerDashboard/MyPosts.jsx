import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getMyPostsAPI, getMyProfileAPI } from "@/services/user.api";
import { deletePostAPI } from "@/services/post.api";
import BoostModal from "@/components/BoostModal";

const FILTERS = [
  { label: "Tất cả", value: "all" },
  { label: "Đang hiển thị", value: "approved" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Từ chối", value: "rejected" },
  { label: "Đã bán", value: "sold" },
];

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null); // ✅ FIX: cần user

  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const [openBoost, setOpenBoost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  /* ---------------- LOAD DATA ---------------- */
  const loadData = async () => {
    try {
      setLoading(true);

      const [postsRes, profileRes] = await Promise.all([
        getMyPostsAPI(),
        getMyProfileAPI(),
      ]);

      setPosts(postsRes.posts || []);
      setProfile(profileRes);
    } catch (err) {
      console.error("Error load my posts:", err);
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (idPost) => {
    if (!window.confirm("Bạn có chắc muốn xoá bài đăng này?")) return;

    setDeletingId(idPost);

    try {
      await deletePostAPI(idPost);
      setPosts((prev) => prev.filter((p) => p.idPost !== idPost));
      toast.success("Đã xoá bài đăng!");
    } catch (err) {
      toast.error("Không thể xoá bài đăng");
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredPosts =
    activeFilter === "all"
      ? posts
      : posts.filter((p) => p.status === activeFilter);

  /* ---------------- OPEN BOOST ---------------- */
  const handleOpenBoost = (post) => {
    setSelectedPost(post); // ✅ QUAN TRỌNG
    setOpenBoost(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        Tin đăng của tôi
      </h1>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`rounded-xl px-3 py-1 border text-xs sm:text-sm ${
              activeFilter === f.value
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white hover:bg-slate-50 text-slate-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-4 relative">
        {filteredPosts.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm border rounded-2xl bg-white">
            {posts.length === 0
              ? "Bạn chưa có tin đăng nào."
              : "Không có tin phù hợp."}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostItem
              key={post.idPost}
              post={post}
              onEdit={() => navigate(`/edit-post/${post.idPost}`)}
              onDelete={() => handleDelete(post.idPost)}
              onBoost={() => handleOpenBoost(post)} // ✅ FIX
              deletingId={deletingId}
            />
          ))
        )}

        {loading && posts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl z-10">
            <div className="flex items-center gap-2 text-slate-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}
      </div>

      {/* ✅ BOOST MODAL FIX HOÀN TOÀN */}
      <BoostModal
        open={openBoost}
        onClose={() => setOpenBoost(false)}
        postId={selectedPost?.idPost}
        isBoosted={selectedPost?.isBoosted}
        user={profile} // ✅ FIX QUAN TRỌNG
        onSuccess={loadData} // ✅ reload đúng
      />
    </div>
  );
}

/* ================= POST ITEM ================= */
const PostItem = ({ post, onEdit, onDelete, deletingId, onBoost }) => {
  const img = post.images?.[0]?.url || null;
  const isDeleting = deletingId === post.idPost;

  // ✅ check boost giống dashboard
  const isBoosted =
    post.isBoosted ||
    (post.boostExpiredAt && new Date(post.boostExpiredAt) > new Date());

  return (
    <div className="border rounded-2xl bg-white p-4 flex gap-4">
      {/* IMAGE */}
      <div className="w-28 h-20 bg-slate-100 rounded-lg overflow-hidden">
        {img ? (
          <img src={img} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">
            Không có ảnh
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{post.title}</h3>

          <span className="text-xs px-2 py-1 rounded-full border bg-slate-50 text-slate-700">
            {post.status}
          </span>
        </div>

        <p className="text-emerald-700 font-semibold">
          {post.price
            ? post.price.toLocaleString("vi-VN") + " đ"
            : "Thoả thuận"}
        </p>

        {/* 🔥 BOOST INFO (GIỐNG DASHBOARD) */}
        {isBoosted && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs space-y-1">
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

        <p className="text-xs text-gray-500 mt-1">
          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
        </p>

        {/* ACTION */}
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            Chỉnh sửa
          </Button>

          <Button
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={onBoost}
          >
            {isBoosted ? "Gia hạn Boost" : "Boost bài đăng"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xoá..." : "Xoá"}
          </Button>
        </div>
      </div>
    </div>
  );
};
