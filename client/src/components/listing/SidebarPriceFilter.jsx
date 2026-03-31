import { useState } from "react";

export default function SidebarPriceFilter({ type, onSelect, onReset }) {
  const [activeIndex, setActiveIndex] = useState(null);

  // ======================
  // BẢNG GIÁ BÁN (TỶ)
  // ======================
  const PRICE_SELL = [
    { label: "Thỏa thuận", min: 0, max: 999999999999 },
    { label: "Dưới 500 triệu", min: 0, max: 500000000 },
    { label: "500 - 800 triệu", min: 500000000, max: 800000000 },
    { label: "800 triệu - 1 tỷ", min: 800000000, max: 1000000000 },
    { label: "1 - 2 tỷ", min: 1000000000, max: 2000000000 },
    { label: "2 - 3 tỷ", min: 2000000000, max: 3000000000 },
    { label: "3 - 5 tỷ", min: 3000000000, max: 5000000000 },
    { label: "5 - 7 tỷ", min: 5000000000, max: 7000000000 },
    { label: "7 - 10 tỷ", min: 7000000000, max: 10000000000 },
    { label: "10 - 20 tỷ", min: 10000000000, max: 20000000000 },
    { label: "20 - 30 tỷ", min: 20000000000, max: 30000000000 },
    { label: "30 - 40 tỷ", min: 30000000000, max: 40000000000 },
    { label: "40 - 60 tỷ", min: 40000000000, max: 60000000000 },
  ];

  // ======================
  // BẢNG GIÁ THUÊ (TRIỆU)
  // ======================
  const PRICE_RENT = [
    { label: "Thỏa thuận", min: 0, max: 999999999 },
    { label: "Dưới 3 triệu", min: 0, max: 3000000 },
    { label: "3 - 5 triệu", min: 3000000, max: 5000000 },
    { label: "5 - 7 triệu", min: 5000000, max: 7000000 },
    { label: "7 - 10 triệu", min: 7000000, max: 10000000 },
    { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
    { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
    { label: "20 - 30 triệu", min: 20000000, max: 30000000 },
    { label: "Trên 30 triệu", min: 30000000, max: 999999999 },
  ];

  const priceList = type === "Cho thuê" ? PRICE_RENT : PRICE_SELL;

  const handleClick = (item, index) => {
    setActiveIndex(index);
    onSelect(item.min, item.max);
  };

  const handleReset = () => {
    setActiveIndex(null);
    onReset(); // báo về ListingLayout để xóa price filter
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">
          Lọc theo khoảng giá ({type === "Cho thuê" ? "triệu/tháng" : "tỷ"})
        </h3>

        {/* Nút Reset */}
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2 text-gray-700">
        {priceList.map((item, i) => (
          <div
            key={i}
            onClick={() => handleClick(item, i)}
            className={`cursor-pointer px-2 py-1 rounded-md transition 
              ${
                activeIndex === i
                  ? "text-red-600 font-semibold bg-red-50"
                  : "hover:text-red-600"
              }
            `}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
