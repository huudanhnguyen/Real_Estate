import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

import { createPostAPI, uploadImagesAPI } from "@/services/post.api";
import { getProvinces, getDistricts, getWards } from "@/services/location.api";
import { getAllTagsAPI } from "@/services/tag.api";

import { formatPriceInput, parsePriceToNumber } from "@/utils/price";

export default function CreatePostPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [tagList, setTagList] = useState([]);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    isNegotiable: false,
    address: "",
    province: "",
    district: "",
    ward: "",
    size: "",
    floor: "",
    bedroom: "",
    bathroom: "",
    isFurniture: false,
    listingType: "Bán",
    propertyType: "Nhà mặt phố",
    direction: "Đông",
    balonDirection: "Đông",
    description: "",
    tags: [],
  });

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ===============================
  // LOAD PROVINCES + TAGS
  // ===============================
  useEffect(() => {
    (async () => {
      try {
        setProvinces(await getProvinces());
      } catch {
        toast.error("Không tải được danh sách tỉnh/thành");
      }

      try {
        const res = await getAllTagsAPI();

        const normalizedTags =
          res?.data?.tags?.map((t) => ({
            id: t.id ?? t.idTag,
            name: t.name ?? t.tag,
          })) ?? [];

        setTagList(normalizedTags);

      } catch {
        toast.error("Không tải được danh sách tag");
      }
    })();
  }, []);

  // ===============================
  // LOCATION HANDLER
  // ===============================
  const handleProvinceChange = async (e) => {
    const code = e.target.value;
    updateField("province", code);
    updateField("district", "");
    updateField("ward", "");
    setDistricts([]);
    setWards([]);

    if (!code) return;

    const data = await getDistricts(code);
    setDistricts(data?.districts ?? []);
  };

  const handleDistrictChange = async (e) => {
    const code = e.target.value;
    updateField("district", code);
    updateField("ward", "");
    setWards([]);

    if (!code) return;

    const data = await getWards(code);
    setWards(data?.wards ?? []);
  };

  // ===============================
  // PRICE FORMATTER
  // ===============================
  const handlePriceChange = (e) => {
    updateField("price", formatPriceInput(e.target.value));
  };

  // ===============================
  // IMAGES
  // ===============================
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...mapped]);
  };

  const handleDeleteImage = (i) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return next;
    });
  };

  // ===============================
  // TAG HANDLER
  // ===============================
  const toggleTag = (idTag) => {
    setForm((prev) => {
      const exists = prev.tags.includes(idTag);
      const next = exists
        ? prev.tags.filter((t) => t !== idTag)
        : [...prev.tags, idTag];
      return { ...prev, tags: next };
    });
  };

  // ===============================
  // VALIDATE FORM
  // ===============================
  const validateForm = () => {
    if (!form.title.trim()) return "Tiêu đề không được để trống";

    if (!form.isNegotiable) {
      const num = parsePriceToNumber(form.price);
      if (!num) return "Giá phải hợp lệ hoặc chọn 'Giá thoả thuận'";
    }

    if (!form.description.trim()) return "Mô tả không được để trống";
    if (!form.address.trim()) return "Chưa nhập địa chỉ";
    if (!form.province) return "Chưa chọn Tỉnh";
    if (!form.district) return "Chưa chọn Quận/Huyện";
    if (!form.ward) return "Chưa chọn Phường/Xã";

    if (images.length === 0) return "Cần ít nhất 1 ảnh";

    return null;
  };

  // ===============================
  // SUBMIT FORM
  // ===============================
  const handleSubmit = async () => {
            console.log(form);

    const err = validateForm();
    if (err) return toast.error(err);

    setLoading(true);

    try {
      const payload = {
        ...form,
        price: form.isNegotiable ? null : parsePriceToNumber(form.price),
        size: Number(form.size || 0),
        floor: Number(form.floor || 0),
        bedroom: Number(form.bedroom || 0),
        bathroom: Number(form.bathroom || 0),
      };

      const res = await createPostAPI(payload);
      const idPost = res?.data?.post?.idPost;

      if (idPost && images.length > 0) {
        await uploadImagesAPI(idPost, images);
      }

      toast.success("Đăng bài thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi đăng bài!");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-red-600">
        Đăng tin bất động sản
      </h1>

      <div className="space-y-10">
        {/* BASIC INFO */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TIÊU ĐỀ */}
            <div>
              <label>Tiêu đề</label>
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* GIÁ */}
            <div>
              <div className="flex items-center justify-between">
                <label>Giá</label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isNegotiable}
                    onChange={(e) => {
                      updateField("isNegotiable", e.target.checked);
                      if (e.target.checked) updateField("price", "");
                    }}
                  />
                  Giá thoả thuận
                </label>
              </div>

              <Input
                type="text"
                value={form.price}
                onChange={handlePriceChange}
                placeholder="VD: 2.500.000.000"
                disabled={form.isNegotiable}
                className="mt-1"
              />
            </div>

            {/* LOẠI GIAO DỊCH */}
            <div>
              <label>Loại giao dịch</label>
              <select
                value={form.listingType}
                onChange={(e) => updateField("listingType", e.target.value)}
                className="border rounded-lg p-2 mt-1 w-full"
              >
                <option>Bán</option>
                <option>Cho thuê</option>
              </select>
            </div>

            {/* LOẠI BĐS */}
            <div>
              <label>Loại bất động sản</label>
              <select
                value={form.propertyType}
                onChange={(e) => updateField("propertyType", e.target.value)}
                className="border rounded-lg p-2 mt-1 w-full"
              >
                <option value="Căn hộ chung cư">Căn hộ chung cư</option>
                <option value="Nhà mặt phố">Nhà mặt phố</option>
                <option value="Nhà riêng">Nhà riêng</option>
                <option value="Nhà phố thương mại">Nhà phố thương mại</option>
                <option value="Biệt thự">Biệt thự</option>
                <option value="Đất nền">Đất nền</option>
                <option value="Bán đất">Bán đất</option>
                <option value="Trang trại">Trang trại</option>
                <option value="Khu nghỉ dưỡng">Khu nghỉ dưỡng</option>
                <option value="Kho">Kho</option>
                <option value="Nhà xưởng">Nhà xưởng</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* MÔ TẢ */}
            <div className="md:col-span-2">
              <label>Mô tả chi tiết</label>
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="mt-1 h-32"
              />
            </div>
          </div>
        </section>
        {/* PROPERTY DETAILS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label>Diện tích (m²)</label>
              <Input
                type="number"
                value={form.size}
                onChange={(e) => updateField("size", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label>Số tầng</label>
              <Input
                type="number"
                value={form.floor}
                onChange={(e) => updateField("floor", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label>Phòng ngủ</label>
              <Input
                type="number"
                value={form.bedroom}
                onChange={(e) => updateField("bedroom", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label>Phòng tắm</label>
              <Input
                type="number"
                value={form.bathroom}
                onChange={(e) => updateField("bathroom", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-3 mt-7">
              <input
                type="checkbox"
                checked={form.isFurniture}
                onChange={(e) => updateField("isFurniture", e.target.checked)}
              />
              <label>Có nội thất</label>
            </div>
          </div>
        </section>
        {/* DIRECTION */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Hướng</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Hướng nhà</label>
              <select
                value={form.direction}
                onChange={(e) => updateField("direction", e.target.value)}
                className="border rounded-lg p-2 mt-1 w-full"
              >
                <option>Đông</option>
                <option>Tây</option>
                <option>Nam</option>
                <option>Bắc</option>
                <option>Đông - Bắc</option>
                <option>Đông - Nam</option>
                <option>Tây - Bắc</option>
                <option>Tây - Nam</option>
              </select>
            </div>

            <div>
              <label>Hướng ban công</label>
              <select
                value={form.balonDirection}
                onChange={(e) => updateField("balonDirection", e.target.value)}
                className="border rounded-lg p-2 mt-1 w-full"
              >
                <option>Đông</option>
                <option>Tây</option>
                <option>Nam</option>
                <option>Bắc</option>
                <option>Đông - Bắc</option>
                <option>Đông - Nam</option>
                <option>Tây - Bắc</option>
                <option>Tây - Nam</option>
              </select>
            </div>
          </div>
        </section>

        {/* ADDRESS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Địa chỉ bất động sản</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PROVINCE */}
            <div>
              <label>Tỉnh/Thành phố</label>
              <select
                value={form.province}
                onChange={(e) => {
                  const code = String(e.target.value).padStart(2, "0");
                  updateField("province", code);
                  updateField("district", "");
                  updateField("ward", "");
                }}
                className="border rounded-lg p-2 mt-1 w-full"
              >
                <option value="">-- Chọn tỉnh --</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DISTRICT */}
            <div>
              <label>Quận/Huyện</label>
              <select
                value={form.district}
                disabled={!form.province}
                onChange={(e) => {
                  const code = String(e.target.value).padStart(3, "0");
                  updateField("district", code);
                  updateField("ward", "");
                }}
                className="border rounded-lg p-2 mt-1 w-full"
              >
                <option value="">-- Chọn quận/huyện --</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* WARD */}
            <div>
              <label>Phường/Xã</label>
              <select
                value={form.ward}
                disabled={!form.district}
                onChange={(e) => {
                  const code = String(e.target.value).padStart(5, "0");
                  updateField("ward", code);
                }}
                className="border rounded-lg p-2 mt-1 w-full"
              >
                <option value="">-- Chọn phường/xã --</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ĐỊA CHỈ CỤ THỂ */}
            <div>
              <label>Địa chỉ cụ thể</label>
              <Input
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </section>

        {/* TAGS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Tiện ích / Tags</h2>

          <div className="flex flex-wrap gap-3">
            {tagList.map((tag) => {
              const selected = form.tags.includes(tag.id);

              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-2 rounded-full border text-sm transition
            ${
              selected
                ? "bg-red-600 text-white border-red-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* IMAGES */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Ảnh bất động sản</h2>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleImageUpload}
            className="border p-3 rounded-lg"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img.preview}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  onClick={() => handleDeleteImage(i)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SUBMIT */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-3 text-lg bg-red-600 hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Đang đăng..." : "Đăng tin"}
          </Button>
        </div>
      </div>
    </div>
  );
}
