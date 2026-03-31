export default function ReportStats() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Báo cáo & thống kê</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Lượt xem tháng này" value="0" />
        <StatCard label="Lượt lưu tin" value="0" />
        <StatCard label="Tin hết hạn" value="0" />
        <StatCard label="Tin bị từ chối" value="0" />
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <p className="text-sm text-slate-600">Biểu đồ (đang cập nhật...)</p>
        <div className="h-48 rounded-xl bg-slate-100 mt-4"></div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border rounded-2xl p-4 bg-white">
      <p className="text-xs text-slate-500 uppercase">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
