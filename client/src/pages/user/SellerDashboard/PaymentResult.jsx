import { useEffect, useState } from "react";
import axios from "@/config/axios";

export default function PaymentResult() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    console.log("🔥 CURRENT URL:", window.location.href);

    const handle = async () => {
      const params = new URLSearchParams(window.location.search);

      const success = params.get("success");
      const tx = params.get("tx");

      console.log("🔥 PARAMS:", { success, tx });

      if (success === "1") {
        console.log("✅ SUCCESS FLOW");
        setStatus("success");
      } else {
        console.log("❌ FAIL FLOW");
        setStatus("fail");
      }
    };

    handle();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      {status === "loading" && <p>Đang xử lý thanh toán...</p>}

      {status === "success" && (
        <div className="text-center">
          <p className="text-green-600 font-semibold text-lg">
            Nạp tiền thành công 🎉
          </p>
          <p className="text-sm text-gray-500 mt-2">
            (Đang chờ hệ thống cập nhật số dư...)
          </p>
        </div>
      )}

      {status === "fail" && (
        <p className="text-red-500 font-semibold">Thanh toán thất bại ❌</p>
      )}
    </div>
  );
}
