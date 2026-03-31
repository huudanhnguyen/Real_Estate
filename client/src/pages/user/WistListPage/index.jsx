import { useEffect, useState } from "react";
import { Heart, Loader2, MapPin } from "lucide-react";
import axios from "@/config/axios";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  // Fetch wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const res = await axios.get("/wishlist");

        // API của bạn trả về res.data.data
        setItems(res.data.data || []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Remove post from wishlist
  const handleRemove = async (idPost) => {
    setRemoving(idPost);

    try {
      await axios.delete(`/wishlist/${idPost}`);
      setItems((prev) => prev.filter((item) => item.idPost !== idPost));
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500 text-lg">
        Bạn chưa lưu bài đăng nào vào wishlist.
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Danh sách yêu thích</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const post = item.Post;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              {/* Image */}
              <Link to={`/post/${post.idPost}`}>
                <img
                  src={post.images?.[0]?.url}
                  alt={post.title}
                  className="w-full h-52 object-cover"
                />
              </Link>

              {/* Content */}
              <div className="p-4 space-y-2">
                <Link
                  to={`/post/${post.idPost}`}
                  className="font-semibold text-lg line-clamp-1"
                >
                  {post.title}
                </Link>

                <p className="text-slate-500 text-sm flex items-center gap-1">
                  <MapPin size={16} /> {post.address}
                </p>

                <p className="font-bold text-red-600 text-lg">
                  {post.price.toLocaleString("vi-VN")} đ
                </p>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(post.idPost)}
                  className="mt-3 w-full flex items-center justify-center gap-2 p-2 rounded-lg border hover:bg-red-50 transition"
                >
                  {removing === post.idPost ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Heart className="w-4 h-4 text-red-500" />
                  )}
                  <span>Xóa khỏi yêu thích</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
