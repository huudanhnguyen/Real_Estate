import { useEffect, useState } from "react";
import {
  getMyProfileAPI,
  updateProfileAPI,
  changePasswordAPI,
  updateAvatarAPI,
} from "@/services/user.api";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function AccountManagement() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const SERVER = import.meta.env.VITE_SERVER_URL;

  // ============================
  // LOAD PROFILE
  // ============================
  useEffect(() => {
    async function load() {
      try {
        const res = await getMyProfileAPI();
        setProfile(res);

        setFullName(res.fullName || "");
        setPhone(res.phone || "");

        if (res.avatar) {
          setAvatarPreview(
            res.avatar.startsWith("http")
              ? res.avatar
              : `${SERVER}${res.avatar}`
          );
        }
      } catch (err) {
        console.error("Load profile error:", err);
      }
    }
    load();
  }, []);

  // ============================
  // SAVE PROFILE
  // ============================
  async function handleSave() {
    try {
      setLoading(true);

      // Nếu có chọn avatar mới → upload
      if (avatarFile) {
        await updateAvatarAPI(avatarFile);
      }

      await updateProfileAPI({ fullName, phone });

      alert("Cập nhật thành công!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  }

  // Chọn avatar → chỉ preview, chưa upload
  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  // ============================
  // ĐỔI MẬT KHẨU
  // ============================
  async function handleChangePassword() {
    if (!currentPassword || !newPassword) return alert("Vui lòng nhập đầy đủ!");

    if (newPassword !== confirmNewPassword)
      return alert("Mật khẩu xác nhận không khớp!");

    try {
      await changePasswordAPI(currentPassword, newPassword);
      alert("Đổi mật khẩu thành công!");
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert("Đổi mật khẩu thất bại!");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        Quản lý tài khoản
      </h1>

      {/* Avatar + Form */}
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full border overflow-hidden bg-slate-200">
            <img
              src={avatarPreview || "https://via.placeholder.com/150"}
              className="w-full h-full object-cover"
            />
          </div>

          <label className="px-4 py-2 border rounded-xl cursor-pointer hover:bg-slate-50">
            Chọn ảnh mới
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <InputItem
            label="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <InputItem
            label="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Button
          className="w-full py-3 bg-emerald-600 text-white rounded-xl"
          disabled={loading}
          onClick={handleSave}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>

        <Button
          className="w-full py-3 bg-slate-700 text-white rounded-xl"
          onClick={() => setOpenModal(true)}
        >
          Đổi mật khẩu
        </Button>
      </div>

      {/* === MODAL PASSWORD === */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>

            <InputItem
              label="Mật khẩu hiện tại"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <InputItem
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <InputItem
              label="Xác nhận mật khẩu mới"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <div className="flex justify-end mt-4 gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setOpenModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                onClick={handleChangePassword}
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================
// INPUT COMPONENT (CÓ ICON CON MẮT)
// =========================================
function InputItem({ label, value, onChange, type = "text" }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      <label className="text-sm text-slate-700">{label}</label>

      <input
        type={isPassword ? (show ? "text" : "password") : type}
        className="w-full px-3 py-2 border rounded-xl mt-1 pr-10"
        value={value}
        onChange={onChange}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}
