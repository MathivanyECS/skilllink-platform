import { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/skilllink-logo.png";
import { getUserNotifications, markNotificationAsRead } from "../../services/notificationService";
import { Notification } from "../../types/notification.types";

interface Props {
  active: "login" | "dashboard" | "collaboration" | "sessions";
  onNotificationClick?: () => void; // Optional now as we handle it internally
  onProfileClick: () => void;
}

const GREEN = "#38AE56";

const TopNavigationBar = ({
  active,
  onNotificationClick,
  onProfileClick
}: Props) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Notifications Logic
  const fetchNotifications = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const data = await getUserNotifications(userId);
      // Sort by latest
      data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // 2. Poll every 5s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // 3. Handle click outside to close dropdown
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
    setShowNotifications(!showNotifications);
    if (onNotificationClick) onNotificationClick();
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      // Update local state
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItemStyle = (isActive: boolean) => ({
    padding: "14px 26px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 17,
    letterSpacing: "0.4px",
    color: "white",
    border: isActive ? `2px solid ${GREEN}` : "2px solid transparent",
    boxShadow: isActive
      ? "0 0 16px rgba(56,174,86,0.95)"
      : "none",
    transition: "all 0.25s ease"
  });

  return (
    <div style={wrapper}>
      {/* LEFT SIDE */}
      <div style={leftGroup}>
        {/* BIG BRAND LOGO */}
        <img
          src={logo}
          style={logoStyle}
          onClick={() => navigate("/")}
          alt="Logo"
        />

        {/* NAVIGATION ITEMS */}
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

      {/* RIGHT SIDE */}
      <div style={rightGroup}>
        {/* NOTIFICATION BELL */}
        <div className="relative" ref={dropdownRef}>
          <div className="relative cursor-pointer" onClick={handleBellClick}>
            <FaBell size={24} color="white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          {/* DROPDOWN */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-gray-700 bg-black/50">
                <h3 className="text-white font-semibold text-sm">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                      className={`p-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition ${notif.isRead ? "opacity-60" : "bg-green-900/10"}`}
                    >
                      <p className="text-sm text-gray-200">{notif.message}</p>
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "Just now"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
          onClick={onProfileClick}
        >
          <FaUserCircle size={28} color="white" />
          <FaChevronDown size={15} color="white" />
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
  position: "relative" as "relative",
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
