import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordAPI } from "@/services/auth.api";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
});

export default function ForgotPassword() {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, control, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (values) => {
    try {
      setErrorMsg("");
      setSuccessMsg("");

      const res = await forgotPasswordAPI(values.email);

      setSuccessMsg(res?.message || "Vui lòng kiểm tra email của bạn!");
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>
        <p className="text-gray-600 mb-6">
          Nhập email, chúng tôi sẽ gửi link khôi phục mật khẩu cho bạn.
        </p>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage /> {/* Hiển thị lỗi Zod */}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang gửi...
                </span>
              ) : (
                "Gửi email khôi phục"
              )}
            </Button>

            {successMsg && (
              <p className="text-green-600 text-center mt-2">{successMsg}</p>
            )}

            {errorMsg && (
              <p className="text-red-600 text-center mt-2">{errorMsg}</p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
