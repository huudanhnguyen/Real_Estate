import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, User, Eye, EyeOff } from "lucide-react";
import { registerAPI } from "@/services/auth.api";
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

const formSchema = z
  .object({
    fullName: z.string().min(1, "Vui lòng nhập họ tên"),
    phone: z
      .string()
      .min(1, "Vui lòng nhập số điện thoại")
      .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    const res = await registerAPI({
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      password: values.password,
    });

    if (res.user) {
      alert("Đăng ký thành công!");
      navigate("/login");
    } else {
      alert(res.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex overflow-hidden">
        {/* LEFT IMAGE */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-red-50 w-1/2">
          <img src="/register-image.png" alt="register" className="w-80" />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-bold mb-1">Tạo tài khoản</h2>
          <p className="text-gray-600 mb-6">Đăng ký để tiếp tục</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Fullname */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-3 text-gray-500"
                          size={18}
                        />
                        <Input
                          className="pl-10"
                          placeholder="Nguyễn Văn A"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-3 text-gray-500"
                          size={18}
                        />
                        <Input
                          className="pl-10"
                          placeholder="0123456789"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-3 text-gray-500"
                          size={18}
                        />
                        <Input
                          className="pl-10"
                          placeholder="email@example.com"
                          type="email"
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
                          className="absolute right-3 top-3 cursor-pointer text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
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

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhập lại mật khẩu</FormLabel>
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
                          className="absolute right-3 top-3 cursor-pointer text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
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

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Đăng ký
              </Button>

              {/* Have account */}
              <p className="text-center text-gray-600 text-sm mt-4">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-red-600 font-medium hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
