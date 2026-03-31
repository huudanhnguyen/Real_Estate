import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { verifyResetTokenAPI, resetPasswordAPI } from "@/services/auth.api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Eye, EyeOff } from "lucide-react";

const schema = z
  .object({
    password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Không bỏ trống"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");

  // 🆕 Show/Hide password
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function verify() {
      const res = await verifyResetTokenAPI(token);
      if (res?.email) {
        setEmail(res.email);
        setValid(true);
      }
      setLoading(false);
    }
    verify();
  }, []);

  const onSubmit = async (values) => {
    const res = await resetPasswordAPI(token, values.password);
    alert(res.message || "Đổi mật khẩu thành công!");
    navigate("/login");
  };

  if (loading)
    return <p className="text-center mt-20">Đang xác minh token...</p>;
  if (!valid)
    return (
      <p className="text-center text-red-600 mt-20">
        Token không hợp lệ hoặc đã hết hạn!
      </p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-3">Đặt lại mật khẩu</h2>
        <p className="text-gray-600 mb-6">Tài khoản: {email}</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPwd ? "text" : "password"}
                        placeholder="•••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPwd(!showPwd)}
                      >
                        {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPwd ? "text" : "password"}
                        placeholder="•••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      >
                        {showConfirmPwd ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Xác nhận
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
