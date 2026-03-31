import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminPostDetailModal from "@/components/admin/AdminPostDetailModal";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  getAdminPostsAPI,
  approvePostAPI,
  rejectPostAPI,
  deletePostAPI,
} from "@/services/adminPost.api";

/* ================= HELPER ================= */
const ONLY_PENDING_CAN_MODERATE = false;

const statusBadge = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

// 🔥 LOGIC LOAD ẢNH GIỐNG ListingCard (CHUẨN)
const getPostThumbnail = (post) => {
  const imgs = post.images?.map((img) => img.url) || [];
  return imgs[0] || null;
};

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);



  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const [totalPages, setTotalPages] = useState(1);

  /* ================= LOAD POSTS ================= */
  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await getAdminPostsAPI(filters);

      setPosts(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      alert(err.response?.data?.message || "Load posts failed");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
  const openDetailModal = (post) => {
    setSelectedPost(post);
    setOpenDetail(true);
  };


  /* ================= ACTIONS ================= */
  const approvePost = async (idPost) => {
    const updated = await approvePostAPI(idPost);
    setPosts((prev) =>
      prev.map((p) =>
        p.idPost === idPost
          ? { ...p, moderationStatus: updated.moderationStatus }
          : p,
      ),
    );
  };

  const rejectPost = async (idPost) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    const updated = await rejectPostAPI(idPost, reason);
    setPosts((prev) =>
      prev.map((p) =>
        p.idPost === idPost
          ? { ...p, moderationStatus: updated.moderationStatus }
          : p,
      ),
    );
  };

  const deletePost = async (idPost) => {
    if (!confirm("Bạn có chắc muốn xoá bài đăng này?")) return;

    await deletePostAPI(idPost);
    setPosts((prev) => prev.filter((p) => p.idPost !== idPost));
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Post Management</h1>

      {/* ================= FILTER ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <Input
          placeholder="Search title..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
        />

        <Select
          value={filters.status || "all"}
          onValueChange={(v) =>
            setFilters({
              ...filters,
              status: v === "all" ? "" : v,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={loadPosts}>Apply</Button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto border rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-500">
              <th className="p-4">Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              posts.map((post) => {
                const thumb = getPostThumbnail(post);

                return (
                  <tr key={post.idPost} className="border-b hover:bg-slate-50">
                    <td className="p-4">
                      {thumb ? (
                        <img
                          src={thumb}
                          className="w-20 h-14 object-cover rounded-md border cursor-pointer"
                          onClick={() => openDetailModal(post)}
                        />
                      ) : (
                        <div
                          className="w-20 h-14 rounded-md border flex items-center justify-center text-xs text-gray-400 cursor-pointer"
                          onClick={() => navigate(`/post/${post.idPost}`)}
                        >
                          No image
                        </div>
                      )}
                    </td>

                    <td
                      className="font-medium cursor-pointer hover:text-red-600"
                      onClick={() => openDetailModal(post)}
                    >
                      {post.title}
                    </td>

                    <td>
                      {post.price ? post.price.toLocaleString() + " đ" : "-"}
                    </td>
                    <td>{post.User?.fullName || "-"}</td>
                    <td>
                      <Badge variant={statusBadge[post.moderationStatus]}>
                        {post.moderationStatus}
                      </Badge>
                    </td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right space-x-2">
                      {post.moderationStatus !== "approved" &&
                        (!ONLY_PENDING_CAN_MODERATE ||
                          post.moderationStatus === "pending") && (
                          <Button
                            size="sm"
                            onClick={() => approvePost(post.idPost)}
                          >
                            Approve
                          </Button>
                        )}

                      {post.moderationStatus !== "rejected" &&
                        (!ONLY_PENDING_CAN_MODERATE ||
                          post.moderationStatus === "pending") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectPost(post.idPost)}
                          >
                            Reject
                          </Button>
                        )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePost(post.idPost)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}

            {!loading && posts.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  No posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-end gap-3 mt-4">
        <Button
          size="sm"
          disabled={filters.page === 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
        >
          Prev
        </Button>

        <span className="text-sm">
          {filters.page} / {totalPages}
        </span>

        <Button
          size="sm"
          disabled={filters.page === totalPages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          Next
        </Button>
      </div>
      <AdminPostDetailModal
        open={openDetail}
        post={selectedPost}
        onClose={() => setOpenDetail(false)}
      />
    </>
  );
}
