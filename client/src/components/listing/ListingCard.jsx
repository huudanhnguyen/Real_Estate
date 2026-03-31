import { Link } from "react-router-dom";
import { Image } from "lucide-react";

const ListingCard = ({ post }) => {
  if (post.moderationStatus !== "approved") {
    return null;
  }
  const { idPost, title, price, address, size, bedroom, images, listingType } =
    post;

  const imgs = images?.map((img) => img.url) || [];

  const mainImage = imgs[0] || "https://via.placeholder.com/800x600";
  const subImages = imgs.slice(1, 4); // lấy 3 ảnh nhỏ tiếp theo
  const extraCount = imgs.length - 4;

  return (
    <Link
      to={`/post/${idPost}`}
      className="block bg-white rounded-xl border overflow-hidden hover:shadow-lg transition p-3"
    >
      {/* IMAGE GRID — GIỐNG BATDONGSAN */}
      <div className="grid grid-cols-3 gap-2 h-48 sm:h-56">
        {/* Main image left */}
        <div className="col-span-2 h-full">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right small images */}
        <div className="grid grid-rows-3 gap-2 h-full">
          {subImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="sub"
              className="w-full h-full object-cover rounded-lg"
            />
          ))}

          {/* Nếu còn nhiều ảnh → hiện số lượng */}
          {extraCount > 0 && (
            <div className="relative w-full h-full">
              <img
                src={imgs[3]}
                className="w-full h-full object-cover rounded-lg brightness-50"
              />
              <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg">
                +{extraCount}
              </span>
            </div>
          )}

          {/* Nếu không đủ 3 ảnh nhỏ → fill placeholder */}
          {subImages.length < 3 &&
            [...Array(3 - subImages.length)].map((_, i) => (
              <div
                key={i}
                className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
              >
                <Image size={20} />
              </div>
            ))}
        </div>
      </div>

      {/* INFO */}
      <div className="mt-3 space-y-1">
        {/* Type */}
        <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs rounded-md">
          {listingType === "Bán" ? "VIP KIM CƯƠNG" : "VIP CHO THUÊ"}
        </span>

        {/* Title */}
        <h3 className="font-bold text-lg line-clamp-2">{title}</h3>

        <div className="text-gray-600 text-sm">
          {address} • {size}m² • {bedroom} PN
        </div>

        {/* Price */}
        <div className="text-red-600 font-bold text-xl">
          {price ? price.toLocaleString("vi-VN") + " đ" : "Giá thỏa thuận"}
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
