import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getProvinces, getDistricts, getWards } from "@/services/location.api";

export default function AdminPostDetailModal({ open, onClose, post }) {
  if (!open || !post) return null;

  const images = post.images?.map((i) => i.url) || [];
  const mainImage = images[0] || "https://via.placeholder.com/900x500";

  const [locationText, setLocationText] = useState("");

  useEffect(() => {
    if (!post?.province || !post?.district || !post?.ward) {
      setLocationText(post.address || "");
      return;
    }

    const loadLocation = async () => {
      try {
        /* ===== PROVINCE ===== */
        const provinces = await getProvinces();
        const province = provinces.find(
          (p) => String(p.code) === String(post.province),
        );

        /* ===== DISTRICT ===== */
        const districtRes = await getDistricts(post.province);
        const districts =
          districtRes?.districts || districtRes?.data?.districts || [];
        const district = districts.find(
          (d) => String(d.code) === String(post.district),
        );

        /* ===== WARD ===== */
        const wardRes = await getWards(post.district);
        const wards = wardRes?.wards || wardRes?.data?.wards || [];
        const ward = wards.find((w) => String(w.code) === String(post.ward));

        const fullAddress = [
          post.address,
          ward?.name,
          district?.name,
          province?.name,
        ]
          .filter(Boolean)
          .join(", ");

        setLocationText(fullAddress);
      } catch (err) {
        console.error("❌ Load location failed", err);
        setLocationText(post.address || "");
      }
    };

    loadLocation();
  }, [post]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 shadow"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto max-h-[90vh] p-6 space-y-8">
          {/* IMAGES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <img
                src={mainImage}
                className="w-full h-[400px] object-cover rounded-xl"
              />
            </div>

            <div className="grid grid-rows-3 gap-4">
              {images.slice(1, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-full h-full object-cover rounded-xl"
                />
              ))}
            </div>
          </div>

          {/* BASIC INFO */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{post.title}</h1>

              <Badge variant="outline">{post.listingType}</Badge>

              <Badge
                variant={
                  post.moderationStatus === "approved"
                    ? "success"
                    : post.moderationStatus === "rejected"
                      ? "destructive"
                      : "warning"
                }
              >
                {post.moderationStatus}
              </Badge>
            </div>

            <div className="text-red-600 text-2xl font-bold">
              {post.price
                ? post.price.toLocaleString("vi-VN") + " đ"
                : "Giá thỏa thuận"}
            </div>

            <div className="text-gray-600 mt-2">
              📍 {locationText || "Đang tải địa chỉ..."}
            </div>
          </div>

          {/* ATTRIBUTES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl">
            <InfoItem label="Diện tích" value={`${post.size} m²`} />
            <InfoItem label="Tầng" value={post.floor} />
            <InfoItem label="Phòng ngủ" value={post.bedroom} />
            <InfoItem label="Phòng tắm" value={post.bathroom} />
            <InfoItem label="Hướng nhà" value={post.direction} />
            <InfoItem label="Hướng ban công" value={post.balonDirection} />
            <InfoItem
              label="Nội thất"
              value={post.isFurniture ? "Có" : "Không"}
            />
            <InfoItem label="Trạng thái" value={post.status} />
          </div>

          {/* DESCRIPTION */}
          <section className="border rounded-xl p-5">
            <h2 className="font-semibold text-lg mb-2">Mô tả chi tiết</h2>
            <p className="whitespace-pre-line text-gray-700">
              {post.description}
            </p>
          </section>

          {/* FOOTER */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}
