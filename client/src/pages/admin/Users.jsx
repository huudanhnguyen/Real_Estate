import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  getAdminUsersAPI,
  updateUserRoleAPI,
  toggleUserLockAPI,
} from "@/services/adminUser.api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // ✅ FIX QUAN TRỌNG
      const { data, pagination } = await getAdminUsersAPI({
        page,
        limit,
        search,
      });

      setUsers(data);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Load users failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */
  const toggleLock = async (id) => {
    try {
      const { isLocked } = await toggleUserLockAPI(id);

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isLocked } : u)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Update status failed");
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      const { role } = await updateUserRoleAPI(id, newRole);

      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      alert(err.response?.data?.message || "Update role failed");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">User Management</h1>

      {/* SEARCH */}
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search name / email / phone..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto border rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-500">
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Score</th>
              <th>Balance</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="p-4 font-medium">{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "-"}</td>

                  <td className="w-[140px]">
                    <Select
                      value={user.role}
                      onValueChange={(val) => changeRole(user.id, val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  <td>
                    <Badge variant={user.isLocked ? "destructive" : "default"}>
                      {user.isLocked ? "locked" : "active"}
                    </Badge>
                  </td>

                  <td>{user.score}</td>
                  <td>{Number(user.balance).toLocaleString()} ₫</td>

                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant={user.isLocked ? "default" : "outline"}
                      onClick={() => toggleLock(user.id)}
                    >
                      {user.isLocked ? "Unlock" : "Lock"}
                    </Button>
                  </td>
                </tr>
              ))}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span className="text-sm text-slate-600">
          Page {page} / {totalPages}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
}
