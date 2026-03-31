import { useEffect, useState } from "react";
import { Search, Map } from "lucide-react";
import SidebarPriceFilter from "./SidebarPriceFilter";
import ListingCard from "./ListingCard";
import { getAllPostsAPI } from "@/services/post.api";

// ==========================
// PRICE FILTERS
// ==========================
const PRICE_SELL = [
  { label: "Dưới 500 triệu", min: 0, max: 500000000 },
  { label: "500 triệu - 1 tỷ", min: 500000000, max: 1000000000 },
  { label: "1 - 2 tỷ", min: 1000000000, max: 2000000000 },
  { label: "2 - 3 tỷ", min: 2000000000, max: 3000000000 },
  { label: "3 - 5 tỷ", min: 3000000000, max: 5000000000 },
  { label: "5 - 7 tỷ", min: 5000000000, max: 7000000000 },
  { label: "7 - 10 tỷ", min: 7000000000, max: 10000000000 },
  { label: "10 - 20 tỷ", min: 10000000000, max: 20000000000 },
  { label: "20 - 50 tỷ", min: 20000000000, max: 50000000000 },
  { label: "Trên 50 tỷ", min: 50000000000, max: 999999999999 },
];

const PRICE_RENT = [
  { label: "Dưới 3 triệu", min: 0, max: 3000000 },
  { label: "3 - 5 triệu", min: 3000000, max: 5000000 },
  { label: "5 - 7 triệu", min: 5000000, max: 7000000 },
  { label: "7 - 10 triệu", min: 7000000, max: 10000000 },
  { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
  { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
  { label: "20 - 30 triệu", min: 20000000, max: 30000000 },
  { label: "Trên 30 triệu", min: 30000000, max: 999999999999 },
];

// ==========================
// AREA / BEDROOM / OTHER FILTERS
// ==========================
const AREA_OPTIONS = [
  { label: "Dưới 30m²", min: 0, max: 30 },
  { label: "30 - 50m²", min: 30, max: 50 },
  { label: "50 - 80m²", min: 50, max: 80 },
  { label: "80 - 100m²", min: 80, max: 100 },
  { label: "100 - 150m²", min: 100, max: 150 },
  { label: "150 - 200m²", min: 150, max: 200 },
  { label: "Trên 200m²", min: 200, max: 99999 },
];

const BEDROOM_OPTIONS = [
  { label: "1 phòng ngủ", value: 1 },
  { label: "2 phòng ngủ", value: 2 },
  { label: "3 phòng ngủ", value: 3 },
  { label: "4 phòng ngủ", value: 4 },
  { label: "5+ phòng ngủ", value: 5 },
];

const BATHROOM_OPTIONS = [
  { label: "1 phòng tắm", value: 1 },
  { label: "2 phòng tắm", value: 2 },
  { label: "3 phòng tắm", value: 3 },
  { label: "4 phòng tắm", value: 4 },
  { label: "5+ phòng tắm", value: 5 },
];

const DIRECTION_OPTIONS = [
  "Đông",
  "Tây",
  "Nam",
  "Bắc",
  "Đông Nam",
  "Đông Bắc",
  "Tây Nam",
  "Tây Bắc",
];

// ===================================================================
// MAIN COMPONENT
// ===================================================================
const ListingLayout = ({ type, title, breadcrumb }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    keyword: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
    bedroom: "",
    bathroom: "",
    direction: "",
    sort: "",
  });

  // Load default posts
  useEffect(() => {
    loadPosts();
  }, [type]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await getAllPostsAPI({ listingType: type });
      setPosts(res.data);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  };

  // APPLY FILTER (ONLY WHEN USER CLICKS)
  const applyFilter = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);

    const cleaned = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v != null) cleaned[k] = v;
    });

    try {
      const res = await getAllPostsAPI({
        listingType: type,
        ...cleaned,
      });
      setPosts(res.data);
    } catch {
      setPosts([]);
    }

    setLoading(false);
  };

  const resetAll = () => {
    setFilters({
      keyword: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
      bedroom: "",
      bathroom: "",
      direction: "",
      sort: "",
    });
    loadPosts();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center w-full md:w-2/3 bg-white border rounded-xl px-4 py-3 shadow-sm">
          <Search className="text-gray-500 mr-3" />
          <input
            placeholder="Nhập từ khoá tìm kiếm..."
            className="flex-1 outline-none text-gray-700"
            value={filters.keyword}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, keyword: e.target.value }))
            }
          />
        </div>

        <button
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
          onClick={applyFilter}
        >
          Tìm kiếm
        </button>
      </div>

      {/* FILTER BAR (Mobile & Desktop) */}
      <div
        className="flex flex-wrap items-center gap-3 mb-8 
     bg-gray backdrop-blur-md sticky top-20 z-30 py-3 px-4 border rounded-xl"
      >
        {/* PROPERTY TYPE */}
        <select
          className="px-4 py-2 border rounded-lg"
          value={filters.propertyType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, propertyType: e.target.value }))
          }
        >
          <option value="">Loại nhà đất</option>
          <option value="Căn hộ chung cư">Chung cư</option>
          <option value="Nhà riêng">Nhà riêng</option>
          <option value="Đất nền">Đất nền</option>
        </select>

        {/* PRICE (Mobile) */}
        <select
          className="px-4 py-2 border rounded-lg md:hidden"
          onChange={(e) => {
            const v = e.target.value;
            if (!v)
              return setFilters((prev) => ({
                ...prev,
                minPrice: "",
                maxPrice: "",
              }));

            const [min, max] = v.split("-");
            setFilters((prev) => ({
              ...prev,
              minPrice: min,
              maxPrice: max,
            }));
          }}
        >
          <option value="">Khoảng giá</option>
          {(type === "Cho thuê" ? PRICE_RENT : PRICE_SELL).map((item, idx) => (
            <option key={idx} value={`${item.min}-${item.max}`}>
              {item.label}
            </option>
          ))}
        </select>

        {/* AREA */}
        <select
          className="px-4 py-2 border rounded-lg"
          onChange={(e) => {
            const v = e.target.value;
            if (!v)
              return setFilters((prev) => ({
                ...prev,
                minSize: "",
                maxSize: "",
              }));

            const [min, max] = v.split("-");
            setFilters((prev) => ({
              ...prev,
              minSize: min,
              maxSize: max,
            }));
          }}
        >
          <option value="">Diện tích</option>
          {AREA_OPTIONS.map((item, idx) => (
            <option key={idx} value={`${item.min}-${item.max}`}>
              {item.label}
            </option>
          ))}
        </select>

        {/* BEDROOM */}
        <select
          className="px-4 py-2 border rounded-lg"
          value={filters.bedroom}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, bedroom: e.target.value }))
          }
        >
          <option value="">Phòng ngủ</option>
          {BEDROOM_OPTIONS.map((b, idx) => (
            <option key={idx} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>

        {/* SORT */}
        <select
          className="px-4 py-2 border rounded-lg"
          value={filters.sort}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sort: e.target.value }))
          }
        >
          <option value="">Sắp xếp</option>
          <option value="price_asc">Giá thấp → cao</option>
          <option value="price_desc">Giá cao → thấp</option>
          <option value="size_asc">Diện tích nhỏ → lớn</option>
          <option value="size_desc">Diện tích lớn → nhỏ</option>
        </select>

        {/* BUTTONS */}
        <button
          onClick={applyFilter}
          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
        >
          Lọc
        </button>

        <button
          onClick={resetAll}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Reset
        </button>
      </div>

      {/* TITLE */}
      <div className="mb-6">
        <div className="text-gray-500">{breadcrumb}</div>
        <h1 className="text-2xl font-bold mt-1">{title}</h1>
        <div className="text-gray-600 mt-1">
          Hiện có <span className="font-semibold">{posts.length}</span> bất động
          sản.
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-12 gap-6">
        {/* SIDEBAR FOR DESKTOP */}
        <aside className="hidden md:block col-span-3 sticky top-24 h-fit">
          <SidebarPriceFilter
            type={type}
            onSelect={(min, max) => {
              setFilters((prev) => ({
                ...prev,
                minPrice: min,
                maxPrice: max,
              }));
            }}
            onReset={() =>
              setFilters((prev) => ({
                ...prev,
                minPrice: "",
                maxPrice: "",
              }))
            }
          />
          <button
            className="mt-4 w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
            onClick={applyFilter}
          >
            Lọc giá
          </button>

          <button
            className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={resetAll}
          >
            Reset
          </button>
        </aside>

        {/* LIST */}
        <div className="col-span-12 md:col-span-9 space-y-6">
          {loading ? (
            <p>Đang tải...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">Không có bài đăng nào.</p>
          ) : (
            posts.map((post) => <ListingCard key={post.idPost} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingLayout;
