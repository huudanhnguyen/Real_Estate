import { useAuth } from "@/context/auth.context";

export default function AdminAccount() {
  const { user } = useAuth();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Tài khoản Admin</h1>

      <div className="max-w-xl space-y-4">
        <div className="border rounded-xl p-4">
          <p className="text-slate-500 text-sm">Họ tên</p>
          <p className="font-medium">{user?.fullName}</p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-slate-500 text-sm">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-slate-500 text-sm">Vai trò</p>
          <p className="font-medium text-red-600">{user?.role}</p>
        </div>

        <p className="text-sm text-slate-500 italic">
          * Chức năng chỉnh sửa thông tin sẽ được thêm sau
        </p>
      </div>
    </>
  );
}
