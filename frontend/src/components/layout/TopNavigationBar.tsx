import { useState, useEffect, useRef } from "react";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import logo from "../../assets/images/skilllink-logo.png";
import { getUserNotifications, markNotificationAsRead } from "../../services/notificationService";
import { Notification } from "../../types/notification.types";

interface Props {
  active: "login" | "dashboard" | "collaboration" | "sessions";
  onNotificationClick?: () => void;
  onProfileClick: () => void;
}

const GREEN = "#38AE56";
const BACKEND_URL = "http://localhost:8081";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const TopNavigationBar = ({ active, onNotificationClick, onProfileClick }: Props) => {
  const navigate = useNavigate();

  /* ================= PROFILE IMAGE ================= */
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    api.get("/profiles/me")
      .then(res => setProfilePicture(res.data.profilePicture))
      .catch(() => setProfilePicture(null));
  }, []);

  /* ================= NOTIFICATIONS ================= */
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const data = await getUserNotifications(userId);
      data.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowNotifications(prev => !prev);
    onNotificationClick?.();
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  /* ================= STYLES ================= */
  const navItemStyle = (isActive: boolean) => ({
    padding: "14px 26px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 17,
    color: "white",
    border: isActive ? `2px solid ${GREEN}` : "2px solid transparent",
    boxShadow: isActive ? "0 0 16px rgba(56,174,86,0.95)" : "none"
  });

  return (
    <div style={wrapper}>
      {/* LEFT */}
      <div style={leftGroup}>
        <img src={logo} style={logoStyle} onClick={() => navigate("/")} />

        <div style={navItemStyle(active === "login")} onClick={() => navigate("/login")}>
          Login
        </div>
        <div style={navItemStyle(active === "dashboard")} onClick={() => navigate("/dashboard")}>
          Dashboard
        </div>
        <div style={navItemStyle(active === "sessions")} onClick={() => navigate("/sessions")}>
          Session Board
        </div>
        <div style={navItemStyle(active === "collaboration")} onClick={() => navigate("/collaboration")}>
          Collaboration
        </div>
      </div>

      {/* RIGHT */}
      <div style={rightGroup}>
        {/* NOTIFICATION BELL */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <div onClick={handleBellClick} style={{ cursor: "pointer" }}>
            <FaBell size={24} color="white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-50">
              {notifications.length === 0 ? (
                <div className="p-6 text-gray-500 text-sm text-center">
                  No notifications
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                    className={`p-3 border-b border-gray-800 cursor-pointer ${n.isRead ? "opacity-60" : "bg-green-900/10"
                      }`}
                  >
                    <p className="text-sm text-gray-200">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* PROFILE ICON */}
        <div onClick={onProfileClick} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundImage: `url(${profilePicture ? `${BACKEND_URL}${profilePicture}` : DEFAULT_AVATAR
                })`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
          <FaChevronDown size={14} color="white" />
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const wrapper: React.CSSProperties = {
  width: "100%",
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 56px",
  background: "linear-gradient(180deg, #151515, #090909)",
  borderBottom: "1px solid #1f1f1f",
  position: "relative",
  zIndex: 50
};

const leftGroup: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 38
};

const rightGroup: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 26
};

const logoStyle: React.CSSProperties = {
  height: 78,
  cursor: "pointer",
  objectFit: "contain"
};

export default TopNavigationBar;
