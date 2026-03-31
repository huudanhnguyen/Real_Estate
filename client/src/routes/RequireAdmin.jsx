import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth.context";

export default function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
