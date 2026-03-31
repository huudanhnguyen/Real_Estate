import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getPostDetailAPI,
  updatePostAPI,
  uploadImagesAPI,
} from "@/services/post.api";
import { getProvinces, getDistricts, getWards } from "@/services/location.api";
import { getAllTagsAPI } from "@/services/tag.api";

import { formatPriceInput, parsePriceToNumber } from "@/utils/price";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [tagList, setTagList] = useState([]);

  const fileInputRef = useRef(null);

  // Normalize for matching province/district names
  const normalize = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/thành phố|tp\.?|tỉnh|quận|huyện|thị xã|phường|xã|thị trấn/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  /* FORM */
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
    listingType: "Bán",
    propertyType: "Nhà mặt phố",
    direction: "Đông",
    balonDirection: "Đông",
    description: "",
    tags: [],
  });

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ============================
      LOAD PROVINCES + TAGS
  ============================ */
  useEffect(() => {
    (async () => {
      try {
        setProvinces(await getProvinces());
      } catch {
        toast.error("Không tải được danh sách tỉnh");
      }

      try {
        const res = await getAllTagsAPI();
        setTagList(res?.data?.tags || []);
      } catch {
        toast.error("Không tải được danh sách tags");
      }
    })();
  }, []);

  /* ============================
      LOAD POST DETAIL
  ============================ */
  useEffect(() => {
    if (!id || provinces.length === 0) return;

    const loadPost = async () => {
      try {
        setLoadingPage(true);

        const post = await getPostDetailAPI(id);
        setOldImages(post.images || []);

        // convert name → code
        const provinceObj = provinces.find(
          (p) => normalize(p.name) === normalize(post.province)
        );
        const provinceCode = provinceObj?.code || "";

        let districtCode = "";
        if (provinceCode) {
          const d = await getDistricts(provinceCode);
          setDistricts(d?.districts || []);
          const districtObj = d?.districts?.find(
            (dd) => normalize(dd.name) === normalize(post.district)
          );
          districtCode = districtObj?.code || "";
        }

        let wardCode = "";
        if (districtCode) {
          const w = await getWards(districtCode);
          setWards(w?.wards || []);
          const wardObj = w?.wards?.find(
            (ww) => normalize(ww.name) === normalize(post.ward)
          );
          wardCode = wardObj?.code || "";
        }

        setForm({
          title: post.title || "",
          price: post.price ? formatPriceInput(post.price.toString()) : "",
          isNegotiable: !!post.isNegotiable,
          address: post.address || "",
          province: provinceCode,
          district: districtCode,
          ward: wardCode,
          size: post.size || "",
          floor: post.floor || "",
          bedroom: post.bedroom || "",
          bathroom: post.bathroom || "",
          listingType: post.listingType || "Bán",
          propertyType: post.propertyType || "Nhà mặt phố",
          direction: post.direction || "Đông",
          balonDirection: post.balonDirection || "Đông",
          description: post.description || "",
          tags: post.tags?.map((t) => t.idTag || t.id) || [],
        });
      } catch (err) {
        toast.error("Không tải được bài đăng");
      } finally {
        setLoadingPage(false);
      }
    };

    loadPost();
  }, [id, provinces]);

  /* ============================
      LOCATION CHANGE
  ============================ */
  const handleProvinceChange = async (e) => {
    const code = e.target.value;
    updateField("province", code);
    updateField("district", "");
    updateField("ward", "");
    setDistricts([]);
    setWards([]);

    if (code) {
      const d = await getDistricts(code);
      setDistricts(d?.districts || []);
    }
  };

  const handleDistrictChange = async (e) => {
    const code = e.target.value;
    updateField("district", code);
    updateField("ward", "");
    setWards([]);

    if (code) {
      const w = await getWards(code);
      setWards(w?.wards || []);
    }
  };

  /* ============================
      PRICE FORMATTER
  ============================ */
  const handlePrice = (e) => {
    updateField("price", formatPriceInput(e.target.value));
  };

  /* ============================
      IMAGES
  ============================ */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...mapped]);
  };

  const handleDeleteNewImage = (i) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  /* ============================
      TAGS
  ============================ */
  const toggleTag = (tagId) => {
    setForm((prev) => {
      const exists = prev.tags.includes(tagId);
      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t !== tagId)
          : [...prev.tags, tagId],
      };
    });
  };

  /* ============================
      VALIDATE
  ============================ */
  const validateForm = () => {
    if (!form.title.trim()) return "Tiêu đề không được để trống";

    if (!form.isNegotiable) {
      const priceNum = parsePriceToNumber(form.price);
      if (!priceNum) return "Giá không hợp lệ hoặc chưa nhập";
    }

    if (!form.description.trim()) return "Hãy nhập mô tả";
    if (!form.address.trim()) return "Hãy nhập địa chỉ cụ thể";
    if (!form.province) return "Chọn Tỉnh";
    if (!form.district) return "Chọn Quận/Huyện";
    if (!form.ward) return "Chọn Phường/Xã";

    if (oldImages.length === 0 && images.length === 0)
      return "Cần ít nhất 1 ảnh";

    return null;
  };

  /* ============================
      SUBMIT
  ============================ */
  const getProvinceName = (code) =>
    provinces.find((p) => p.code == code)?.name || "";
  const getDistrictName = (code) =>
    districts.find((d) => d.code == code)?.name || "";
  const getWardName = (code) => wards.find((w) => w.code == code)?.name || "";

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return toast.error(error);

    setSaving(true);

    try {
      const payload = {
        ...form,
        price: form.isNegotiable ? null : parsePriceToNumber(form.price),

        province: getProvinceName(form.province),
        district: getDistrictName(form.district),
        ward: getWardName(form.ward),
      };

      // remove empty fields
      const cleanPayload = {};
      Object.keys(payload).forEach((k) => {
        if (payload[k] !== "" && payload[k] !== null) {
          cleanPayload[k] = payload[k];
        }
      });

      await updatePostAPI(id, cleanPayload);

      if (images.length > 0) {
        await uploadImagesAPI(id, images);
      }

      toast.success("Cập nhật thành công!");
      navigate("/seller/posts");
    } catch (err) {
      toast.error("Lỗi cập nhật bài đăng");
    } finally {
      setSaving(false);
    }
  };

  /* ============================
      LOADING
  ============================ */
  if (loadingPage) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Đang tải bài đăng...</span>
      </div>
    );
  }

  /* ============================
      RENDER
  ============================ */
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-red-600">Chỉnh sửa bài đăng</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>

      <div className="space-y-10">
        {/* BASIC INFO */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Tiêu đề</label>
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* PRICE + IS_NEGOTIABLE */}
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
                onChange={handlePrice}
                placeholder="VD: 2.500.000.000"
                disabled={form.isNegotiable}
                className="mt-1"
              />
            </div>

            <div>
              <label>Loại giao dịch</label>
              <select
                value={form.listingType}
                onChange={(e) => updateField("listingType", e.target.value)}
                className="border rounded-lg px-3 py-2 mt-1 w-full"
              >
                <option>Bán</option>
                <option>Cho thuê</option>
              </select>
            </div>

            <div>
              <label>Loại bất động sản</label>
              <select
                value={form.propertyType}
                onChange={(e) => updateField("propertyType", e.target.value)}
                className="border rounded-lg px-3 py-2 mt-1 w-full"
              >
                <option>Nhà mặt phố</option>
                <option>Căn hộ</option>
                <option>Nhà riêng</option>
                <option>Biệt thự</option>
                <option>Đất nền</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label>Mô tả</label>
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="mt-1 h-32"
              />
            </div>
          </div>
        </section>

        {/* DETAIL INFO */}
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

            <div>
              <label>Hướng nhà</label>
              <select
                value={form.direction}
                onChange={(e) => updateField("direction", e.target.value)}
                className="border rounded-lg px-3 py-2 mt-1 w-full"
              >
                <option>Đông</option>
                <option>Tây</option>
                <option>Nam</option>
                <option>Bắc</option>
              </select>
            </div>

            <div>
              <label>Hướng ban công</label>
              <select
                value={form.balonDirection}
                onChange={(e) => updateField("balonDirection", e.target.value)}
                className="border rounded-lg px-3 py-2 mt-1 w-full"
              >
                <option>Đông</option>
                <option>Tây</option>
                <option>Nam</option>
                <option>Bắc</option>
              </select>
            </div>
          </div>
        </section>

        {/* ADDRESS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Địa chỉ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Tỉnh/Thành phố</label>
              <select
                value={form.province}
                onChange={handleProvinceChange}
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

            <div>
              <label>Quận/Huyện</label>
              <select
                value={form.district}
                onChange={handleDistrictChange}
                disabled={!form.province}
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

            <div>
              <label>Phường/Xã</label>
              <select
                value={form.ward}
                onChange={(e) => updateField("ward", e.target.value)}
                disabled={!form.district}
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
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-2 rounded-lg border ${
                    selected
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tag.tag}
                </button>
              );
            })}
          </div>
        </section>

        {/* IMAGES */}
        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Ảnh bất động sản</h2>

          {oldImages.length > 0 && (
            <>
              <p className="text-sm mb-2">Ảnh hiện tại:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {oldImages.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                ))}
              </div>
            </>
          )}

          <p className="text-sm text-slate-600 mb-2">
            Thêm ảnh mới (tuỳ chọn):
          </p>

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
                  onClick={() => handleDeleteNewImage(i)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="px-10 py-3 text-lg bg-red-600 hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
