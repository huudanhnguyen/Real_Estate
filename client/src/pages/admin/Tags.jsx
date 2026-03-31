import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  getAdminTagsAPI,
  createTagAPI,
  deleteTagAPI,
} from "@/services/adminTag.api";

export default function AdminTags() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= LOAD TAGS ================= */
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await getAdminTagsAPI();
      setTags(data);
    } catch (err) {
      alert(err.response?.data?.message || "Load tags failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD TAG ================= */
  const addTag = async () => {
    if (!newTag.trim()) return;

    try {
      const tag = await createTagAPI(newTag.trim());
      setTags((prev) => [...prev, tag]);
      setNewTag("");
    } catch (err) {
      alert(err.response?.data?.message || "Create tag failed");
    }
  };

  /* ================= DELETE TAG ================= */
const removeTag = async (id) => {
  if (!confirm("Bạn có chắc muốn xoá tag này?")) return;

  try {
    await deleteTagAPI(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
  } catch (err) {
    const message = err.response?.data?.message || "Không thể xoá tag đang sử dụng";

    alert(message);
  }
};


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý Tags</h1>

      {/* ADD TAG */}
      <div className="flex gap-3 max-w-md">
        <Input
          placeholder="Nhập tên tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <Button onClick={addTag}>Thêm</Button>
      </div>

      {/* TAG LIST */}
      {loading && <p className="text-sm text-gray-500">Đang tải tags...</p>}

      {!loading && tags.length === 0 && (
        <p className="text-sm text-gray-500">Chưa có tag nào</p>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full"
          >
            <span className="text-sm font-medium text-slate-700">
              {tag.name}
            </span>

            <button
              className="text-xs text-red-500 hover:text-red-700"
              onClick={() => removeTag(tag.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
