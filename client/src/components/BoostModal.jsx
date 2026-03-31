import { useEffect, useState } from "react";
import { getPricingAPI } from "@/services/pricing.api";
import { boostPostAPI } from "@/services/postBoost.api";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { renewBoostAPI } from "@/services/postBoost.api";

export default function BoostModal({ open, onClose, postId, user, onSuccess, isBoosted }) {
  const [pricings, setPricings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetch = async () => {
      try {
        const res = await getPricingAPI();
        setPricings(res.data.data || []);
      } catch (err) {
        console.error("Lỗi load pricing:", err);
      }
    };

    fetch();
  }, [open]);

  const selectedPackage = pricings.find((p) => p.id === selected);

  const previewDate = () => {
    if (!selectedPackage) return null;
    return dayjs().add(selectedPackage.expiredDay, "day").format("DD/MM/YYYY");
  };

const handleBoost = async () => {
  if (!selected) {
    toast.error("Chọn gói trước");
    return;
  }

  try {
    setLoading(true);

    let res;

    if (isBoosted) {
      res = await renewBoostAPI(postId);
    } else {
      res = await boostPostAPI(postId, selected);
    }

    console.log("BOOST RESULT:", res);

    toast.success("Thành công 🚀");

    onClose();
    onSuccess && onSuccess();
  } catch (err) {
    const message = err?.response?.data?.message || "Thất bại";
    toast.error(`❌ ${message}`);
  } finally {
    setLoading(false);
  }
};

  if (!open) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        {" "}
        <div className="bg-white p-5 rounded-xl">Đang tải dữ liệu...</div>{" "}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {" "}
      <div className="bg-white w-[420px] rounded-xl p-5 space-y-4">
        {" "}
        <h2 className="text-lg font-bold">Chọn gói Boost</h2>
        <div className="text-sm space-y-1">
          <div>💰 Số dư: {user.balance?.toLocaleString("vi-VN")} đ</div>
          <div>⭐ Uy tín: {user.score}</div>
        </div>
        {pricings.map((p) => {
          const notEnoughScore = user.score < p.requireScore;
          const notEnoughMoney = user.balance < p.price;
          const disabled = notEnoughScore || notEnoughMoney;

          return (
            <div
              key={p.id}
              onClick={() => !disabled && setSelected(p.id)}
              className={`border p-3 rounded-lg cursor-pointer transition
            ${selected === p.id ? "border-yellow-500 bg-yellow-50" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
            >
              <div className="flex justify-between">
                <div className="font-semibold">
                  {p.name}
                  {p.priority >= 10 && " ⭐ VIP"}
                </div>

                <div className="text-red-600 font-bold">
                  {p.price === 0
                    ? "Miễn phí"
                    : p.price.toLocaleString("vi-VN") + " đ"}
                </div>
              </div>

              <div className="text-sm text-gray-600">{p.expiredDay} ngày</div>

              {notEnoughScore && (
                <div className="text-xs text-red-500">
                  ❌ Cần {p.requireScore} điểm
                </div>
              )}

              {notEnoughMoney && (
                <div className="text-xs text-red-500">❌ Không đủ tiền</div>
              )}

              {!disabled && (
                <div className="text-xs text-green-600">✔ Có thể sử dụng</div>
              )}
            </div>
          );
        })}
        {selectedPackage && (
          <div className="text-sm text-blue-600">
            📅 Gia hạn thêm {selectedPackage.expiredDay} ngày → hết hạn:{" "}
            {previewDate()}
          </div>
        )}
        <button
          onClick={handleBoost}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Đang xử lý..." : "Xác nhận Boost"}
        </button>
        <button onClick={onClose} className="w-full text-gray-500 text-sm">
          Huỷ
        </button>
      </div>
    </div>
  );
}
