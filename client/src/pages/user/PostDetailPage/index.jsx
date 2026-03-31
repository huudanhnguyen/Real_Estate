import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrCreateConversationAPI } from "@/services/chat.service";
import {
  Heart,
  Phone,
  MapPin,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

import { getProvinces, getDistricts, getWards } from "@/services/location.api";
import {
  checkWishlistAPI,
  addWishlistAPI,
  removeWishlistAPI,
} from "@/services/wishlist.api";
import { getPostDetailAPI } from "@/services/post.api";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // LOCATION
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .replace(/tỉnh|thành phố|quận|huyện|thị xã|phường|xã|tp\.?/g, "")
      .trim();

  const getProvinceName = (code) =>
    provinces.find((p) => p.code == code)?.name || "";

  const getDistrictName = (code) =>
    districts.find((d) => d.code == code)?.name || "";

  const getWardName = (code) => wards.find((w) => w.code == code)?.name || "";

  /* --------------------------------
        LOAD PROVINCES
  -------------------------------- */
  useEffect(() => {
    (async () => {
      const p = await getProvinces();
      setProvinces(p || []);
    })();
  }, []);

  /* --------------------------------
        LOAD POST DETAIL + WISHLIST
  -------------------------------- */
  useEffect(() => {
    if (!id || provinces.length === 0) return;

    const loadDetail = async () => {
      try {
        setLoading(true);

        const data = await getPostDetailAPI(id);
        setPost(data);

        try {
          const isLiked = await checkWishlistAPI(id);
          setLiked(!!isLiked);
        } catch (err) {
          console.log("CHECK WISHLIST ERROR:", err);
          setLiked(false);
        }

        // Convert province → code
        const provinceObj = provinces.find(
          (p) => normalize(p.name) === normalize(data.province)
        );
        const pCode = provinceObj?.code || "";

        if (pCode) {
          const dData = await getDistricts(pCode);
          setDistricts(dData?.districts || []);

          const districtObj = dData?.districts?.find(
            (d) => normalize(d.name) === normalize(data.district)
          );
          const dCode = districtObj?.code || "";

          if (dCode) {
            const wData = await getWards(dCode);
            setWards(wData?.wards || []);
          }
        }

        setActiveImageIndex(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id, provinces]);

  /* --------------------------------
            TOGGLE WISHLIST
  -------------------------------- */
  const toggleWishlist = async () => {
    if (!post || loadingLike) return;

    setLoadingLike(true);

    try {
      const idPost = post.idPost || id;

      if (liked) {
        await removeWishlistAPI(idPost);
        setLiked(false);
      } else {
        await addWishlistAPI(idPost);
        setLiked(true);
      }
    } catch (err) {
      console.log("TOGGLE WISHLIST ERROR:", err);
    } finally {
      setLoadingLike(false);
    }
  };
  const handleChat = async () => {
    if (!post?.User?.id) return;

    try {
      const res = await getOrCreateConversationAPI(post.User.id);
      const conversationId = res?.id || res?.data?.id;

      navigate("/messages", {
        state: {
          conversationId,
          receiver: post.User,
        },
      });
    } catch (err) {
      console.error("CHAT ERROR:", err);
    }
  };

  /* --------------------------------
            LOADING UI
  -------------------------------- */
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center gap-2 text-slate-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        Đang tải chi tiết bài đăng...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-slate-600">
        Không tìm thấy bài đăng.
      </div>
    );
  }

  /* --------------------------------
            DISPLAY VALUES
  -------------------------------- */
  const images = post.images || [];
  const mainImage =
    images[activeImageIndex]?.url ||
    "https://via.placeholder.com/800x400?text=No+Image";

  const priceText = post.price
    ? `${post.price.toLocaleString("vi-VN")} đ`
    : "Giá thoả thuận";

  const provinceName = isNaN(post.province)
    ? post.province
    : getProvinceName(post.province);

  const districtName = isNaN(post.district)
    ? post.district
    : getDistrictName(post.district);

  const wardName = isNaN(post.ward) ? post.ward : getWardName(post.ward);

  const fullAddress = [post.address, wardName, districtName, provinceName]
    .filter(Boolean)
    .join(", ");

  const agentPhone = post.User?.phone || post.User?.phoneNumber || "0900000000";
  const phoneDigits = agentPhone.replace(/\D/g, "");
  const zaloLink = phoneDigits ? `https://zalo.me/${phoneDigits}` : null;

  const googleMapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    fullAddress || provinceName || "Việt Nam"
  )}&output=embed`;

  const agent = {
    name: post.User?.fullName || "Môi giới",
    avatar: post.User?.avatar || "https://i.pravatar.cc/90",
    date:
      post.createdAt &&
      `Đăng ngày ${new Date(post.createdAt).toLocaleDateString("vi-VN")}`,
  };

  const hasNext = activeImageIndex < images.length - 1;
  const hasPrev = activeImageIndex > 0;

  /* --------------------------------
              RENDER UI
  -------------------------------- */
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT CONTENT */}
        <div className="col-span-12 lg:col-span-8">
          {/* IMAGE GALLERY */}
          <div className="relative rounded-xl overflow-hidden mb-3">
            <img
              src={mainImage}
              className="w-full h-[400px] object-cover"
              alt={post.title}
            />

            {/* Prev */}
            {images.length > 1 && (
              <>
                <button
                  disabled={!hasPrev}
                  onClick={() =>
                    setActiveImageIndex((prev) => Math.max(0, prev - 1))
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Next */}
                <button
                  disabled={!hasNext}
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      Math.min(images.length - 1, prev + 1)
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* THUMBNAILS */}
          {images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`border rounded-lg overflow-hidden flex-shrink-0 ${
                    i === activeImageIndex
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={img.url}
                    className="w-28 h-20 object-cover"
                    alt={`thumb-${i}`}
                  />
                </button>
              ))}
            </div>
          )}

          {/* BREADCRUMB */}
          <div className="text-sm text-gray-500 mt-4 flex flex-wrap gap-1">
            <span>{post.listingType}</span> /<span>{post.propertyType}</span>
            {provinceName && <span>/ {provinceName}</span>}
            {districtName && <span>/ {districtName}</span>}
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold mt-2">{post.title}</h1>

          {/* INFO BAR */}
          <div className="flex flex-wrap items-center justify-between mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{fullAddress}</span>
            </div>

            <button
              disabled={loadingLike}
              onClick={toggleWishlist}
              className={`flex items-center gap-1 ${
                liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            >
              {loadingLike ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Heart
                  className={`w-5 h-5 ${
                    liked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              )}
              {liked ? "Đã lưu" : "Lưu tin"}
            </button>
          </div>

          {/* INFO BLOCK */}
          <div className="bg-gray-50 border rounded-xl p-5 mt-5 flex flex-wrap gap-6">
            <div>
              <div className="text-gray-500">Giá</div>
              <div className="text-red-600 font-bold text-xl">{priceText}</div>
            </div>

            {post.size && (
              <div>
                <div className="text-gray-500">Diện tích</div>
                <div className="font-semibold">{post.size} m²</div>
              </div>
            )}

            {post.bedroom !== undefined && (
              <div>
                <div className="text-gray-500">Phòng ngủ</div>
                <div className="font-semibold">{post.bedroom} PN</div>
              </div>
            )}

            {post.bathroom !== undefined && (
              <div>
                <div className="text-gray-500">Phòng tắm</div>
                <div className="font-semibold">{post.bathroom} WC</div>
              </div>
            )}

            {post.direction && (
              <div>
                <div className="text-gray-500">Hướng nhà</div>
                <div className="font-semibold">{post.direction}</div>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <h2 className="text-xl font-semibold mt-8 mb-3">Thông tin mô tả</h2>
          <p className="leading-7 text-gray-700 whitespace-pre-line">
            {post.description || "Chưa có mô tả"}
          </p>

          {/* FEATURES */}
          <h2 className="text-xl font-semibold mt-8">Đặc điểm bất động sản</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
            {[
              post.size && `Diện tích: ${post.size} m²`,
              post.bedroom && `Phòng ngủ: ${post.bedroom}`,
              post.bathroom && `Phòng tắm: ${post.bathroom}`,
              post.direction && `Hướng nhà: ${post.direction}`,
              post.balonDirection && `Hướng ban công: ${post.balonDirection}`,
            ]
              .filter(Boolean)
              .map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle size={18} color="#52c41a" />
                  {text}
                </div>
              ))}
          </div>

          {/* MAP */}
          <h2 className="text-xl font-semibold mt-8 mb-3">Xem trên bản đồ</h2>
          <div className="rounded-xl overflow-hidden border">
            <iframe
              title="map"
              src={googleMapSrc}
              className="w-full h-[350px] border-0"
              loading="lazy"
            ></iframe>
          </div>

          {/* RELATED PROPERTIES (FAKE) */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            Bất động sản tương tự
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden shadow-sm bg-white"
              >
                <img
                  src={images[0]?.url || mainImage}
                  className="w-full h-32 object-cover"
                  alt="similar"
                />
                <div className="p-3">
                  <div className="font-semibold line-clamp-2">{post.title}</div>
                  <div className="text-red-600 font-bold text-sm mt-1">
                    {priceText}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {fullAddress || "Đang cập nhật địa chỉ"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 lg:col-span-4">
          <div className="border rounded-xl shadow-sm p-4 sticky top-4 bg-white">
            <h3 className="font-semibold mb-4">Môi giới phụ trách</h3>

            <div className="flex items-center gap-4">
              <img
                src={agent.avatar}
                className="w-16 h-16 rounded-full object-cover"
                alt={agent.name}
              />
              <div>
                <div className="font-bold">{agent.name}</div>
                <div className="text-gray-500 text-sm">{agent.date}</div>
              </div>
            </div>

            {zaloLink && (
              <button
                onClick={handleChat}
                className="
    mt-3 w-full py-2
    bg-blue-500 hover:bg-blue-600
    text-white rounded-lg
    flex items-center justify-center gap-2
    text-sm font-medium
  "
              >
                <MessageCircle size={18} />
                Chat với môi giới
              </button>
            )}

            <a
              href={`tel:${phoneDigits}`}
              className="mt-3 w-full py-2 bg-white border rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <Phone size={18} />
              Gọi {agentPhone}
            </a>
          </div>

          <div className="border rounded-xl p-4 mt-4 bg-white">
            <h3 className="font-semibold mb-2">Khu vực xung quanh</h3>
            <ul className="text-gray-700 text-sm leading-7">
              {provinceName && <li>{provinceName}</li>}
              {districtName && <li>{districtName}</li>}
              {wardName && <li>{wardName}</li>}
              {fullAddress && <li>{fullAddress}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostDetailPage;
