import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth.context";


export default function LoginSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useAuth();

  useEffect(() => {
    const accessToken = params.get("accessToken");

    setAccessToken(accessToken);

    fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        navigate("/");
      });
  }, []);

  return <p className="text-center mt-10">Đang đăng nhập bằng Google...</p>;
}
