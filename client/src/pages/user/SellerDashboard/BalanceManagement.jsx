import { useEffect, useState } from "react";
import { getMyProfileAPI, topupAPI } from "@/services/user.api";
import { toast } from "react-hot-toast";

const BalanceManagement = () => {
  const [balance, setBalance] = useState(0);
  const [score, setScore] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);

  const [amount, setAmount] = useState(100000);

  /* ---------------- LOAD PROFILE ---------------- */
  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyProfileAPI();

      setBalance(res.balance || 0);
      setScore(res.score || 0);
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error("Error loading balance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------------- STRIPE TOPUP ---------------- */
const handleTopup = async () => {
  try {
    if (!amount || amount <= 0) {
      toast.error("Nhập số tiền hợp lệ");
      return;
    }

    setTopupLoading(true);

    const res = await topupAPI(amount);

    console.log("TOPUP:", res);

    // ✅ FIX CHÍNH Ở ĐÂY
    const paymentUrl = res?.paymentUrl;

    if (!paymentUrl) {
      toast.error("Không lấy được link thanh toán");
      return;
    }

    window.location.href = paymentUrl;
  } catch (err) {
    const msg = err?.response?.data?.message || "Nạp tiền thất bại";
    toast.error(msg);
  } finally {
    setTopupLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý số dư</h1>

      {/* SỐ DƯ */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <p className="text-slate-600 text-sm">Số dư hiện tại</p>

        {loading ? (
          <p className="text-slate-400">Đang tải...</p>
        ) : (
          <p className="text-3xl font-bold text-emerald-600">
            {balance.toLocaleString("vi-VN")} đ
          </p>
        )}

        {/* INPUT */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
          className="border px-3 py-2 rounded-lg w-full"
          placeholder="VD: 100000"
        />

        {/* QUICK BUTTONS */}
        <div className="flex gap-2">
          {[100000, 500000, 1000000].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className="flex-1 border rounded-lg py-1 text-sm hover:bg-gray-100"
            >
              {val.toLocaleString("vi-VN")} đ
            </button>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleTopup}
          disabled={topupLoading || amount <= 0}
          className={`px-4 py-2 rounded-xl text-white text-sm w-full ${
            topupLoading ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {topupLoading ? "Đang chuyển sang Stripe..." : "Nạp tiền"}
        </button>
      </div>

      {/* SCORE */}
      <div className="bg-white border rounded-2xl p-6">
        <p className="text-slate-600 text-sm">Điểm uy tín</p>

        {loading ? (
          <p className="text-slate-400">Đang tải...</p>
        ) : (
          <p className="text-2xl font-semibold text-indigo-600">{score}</p>
        )}
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white border rounded-2xl p-6">
        <p className="font-semibold mb-4">Lịch sử giao dịch</p>

        {loading ? (
          <p className="text-sm text-slate-500">Đang tải...</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có giao dịch nào.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="p-3 border rounded-xl bg-slate-50 flex items-center justify-between"
              >
                <span>{t.description}</span>
                <span className="font-semibold">
                  {t.amount.toLocaleString("vi-VN")} đ
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BalanceManagement;
