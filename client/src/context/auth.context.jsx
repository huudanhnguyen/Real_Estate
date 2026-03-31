/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { getMyProfileAPI } from "@/services/user.api";
import { connectSocket, disconnectSocket, socket } from "@/config/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /* ================= USER ================= */
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  /* ================= BADGE ================= */
  const [unreadMessages, setUnreadMessages] = useState(() => {
    return Number(localStorage.getItem("unreadMessages")) || 0;
  });

  const [unreadNoti, setUnreadNoti] = useState(() => {
    return Number(localStorage.getItem("unreadNoti")) || 0;
  });

  /* ================= LOCAL STORAGE ================= */
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [user, accessToken]);

  /* ================= AUTO LOAD USER (RẤT QUAN TRỌNG) ================= */
  useEffect(() => {
    if (!accessToken) return;
    if (user) return; // đã có user thì không gọi lại

    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  /* ================= SOCKET CONNECT ================= */
  useEffect(() => {
    if (user?.id && accessToken) {
      connectSocket(user.id);
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [user, accessToken]);

  /* ================= SOCKET EVENTS ================= */
  useEffect(() => {
    if (!user?.id) return;

    const onNewMessage = () => {
      if (window.location.pathname.startsWith("/messages")) return;

      setUnreadMessages((prev) => {
        const next = prev + 1;
        localStorage.setItem("unreadMessages", next);
        return next;
      });
    };

    const onNewNotification = () => {
      setUnreadNoti((prev) => {
        const next = prev + 1;
        localStorage.setItem("unreadNoti", next);
        return next;
      });
    };

    socket.on("new_message", onNewMessage);
    socket.on("new_notification", onNewNotification);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("new_notification", onNewNotification);
    };
  }, [user]);

  /* ================= REFRESH USER ================= */
  const refreshUser = async () => {
    try {
      const fresh = await getMyProfileAPI();
      setUser(fresh);
      localStorage.setItem("user", JSON.stringify(fresh));
    } catch (err) {
      console.error("REFRESH USER ERROR:", err);
      logout(); // token lỗi thì logout luôn
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setUnreadMessages(0);
    setUnreadNoti(0);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("unreadMessages");
    localStorage.removeItem("unreadNoti");

    disconnectSocket();
  };

  /* ================= FLAGS ================= */
  const isAuthenticated = !!accessToken;
  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        isAuthenticated,
        isAdmin,
        logout,
        refreshUser,
        unreadMessages,
        setUnreadMessages,
        unreadNoti,
        setUnreadNoti,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
