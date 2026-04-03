/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { getMyProfileAPI } from "@/services/user.api";
import { connectSocket, disconnectSocket, socket } from "@/config/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [unreadMessages, setUnreadMessages] = useState(() => {
    return Number(localStorage.getItem("unreadMessages")) || 0;
  });

  const [unreadNoti, setUnreadNoti] = useState(() => {
    return Number(localStorage.getItem("unreadNoti")) || 0;
  });

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      connectSocket(user.id);
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [user]);

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

  const refreshUser = async () => {
    try {
      const fresh = await getMyProfileAPI();
      setUser(fresh);
    } catch (err) {
      console.error("REFRESH USER ERROR:", err);
      logout();
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout API error:", err);
    }

    setUser(null);
    setUnreadMessages(0);
    setUnreadNoti(0);

    localStorage.removeItem("unreadMessages");
    localStorage.removeItem("unreadNoti");

    disconnectSocket();
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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