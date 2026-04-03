import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginAPI } from "@/services/auth.api";
import { useAuth } from "@/context/auth.context";
import { GOOGLE_LOGIN_URL } from "@/config/auth.config";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const res = await loginAPI(values);

    if (res.user) {
      setUser(res.user);
      alert("Đăng nhập thành công!");
      navigate("/");
    } else {
      alert(res.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex overflow-hidden">
        {/* LEFT IMAGE */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-red-50 w-1/2">
          <img src="/register-image.png" alt="login" className="w-80" />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-bold mb-1">Xin chào bạn</h2>
          <p className="text-gray-600 mb-6">Đăng nhập để tiếp tục</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email hoặc SĐT</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-3 text-gray-500"
                          size={18}
                        />
                        <Input
                          className="pl-10"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-3 text-gray-500"
                          size={18}
                        />
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          placeholder="••••••"
                          {...field}
                        />
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 cursor-pointer text-gray-500"
                        >
                          {showPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                {/* <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Nhớ tài khoản
                </label> */}

                <Link
                  to="/forgot-password"
                  className="text-red-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Đăng nhập
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">Hoặc</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={() => (window.location.href = GOOGLE_LOGIN_URL)}
                className="w-full py-3 border rounded-lg flex justify-center items-center gap-2 hover:bg-gray-100 transition"
              >
                <img
                  src="https://img.icons8.com/color/48/google-logo.png"
                  className="w-5"
                />
                Đăng nhập với Google
              </button>

              {/* Register link */}
              <p className="text-center text-gray-600 text-sm mt-4">
                Chưa là thành viên?{" "}
                <Link
                  to="/register"
                  className="text-red-600 font-medium hover:underline"
                >
                  Đăng ký tại đây
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
