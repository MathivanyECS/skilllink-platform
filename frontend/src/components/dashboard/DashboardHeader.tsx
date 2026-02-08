
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
// import { useAuth } from "../../hooks/useAuth"; // Assuming useAuth exists
import ProfileDropdown from "./ProfileDropdown";
// import NotificationDrawer from "./NotificationDrawer"; // Assuming NotificationDrawer exists
// import { getUnreadCount } from "../../services/notificationService"; // Assuming service exists

interface Props {
    unreadCount?: number;
    setUnreadCount?: (count: number) => void;
    customStyle?: React.CSSProperties;
}

const DashboardHeader = ({ unreadCount = 0, setUnreadCount, customStyle }: Props) => {
    const navigate = useNavigate();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div style={{ ...headerStyle, ...customStyle }}>
            <div style={logoContainer} onClick={() => navigate("/dashboard")}>
                <span style={logoText}>Skill<span style={{ color: "#38AE56" }}>Link</span></span>
            </div>

            <div style={navContainer}>
                <button onClick={() => navigate("/dashboard")} style={navLink}>Dashboard</button>
                <button onClick={() => navigate("/sessions")} style={navLink}>Sessions</button>
                <button onClick={() => navigate("/collaboration")} style={navLink}>Collaboration</button>
            </div>

            <div style={actionsContainer}>
                <div style={iconWrapper} onClick={() => setShowNotifications(!showNotifications)}>
                    <FaBell size={20} color="#b0b0b0" />
                    {unreadCount > 0 && <span style={badge}>{unreadCount}</span>}
                </div>
                <div style={profileWrapper} onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                    <FaUserCircle size={32} color="#b0b0b0" />
                </div>
                {showProfileDropdown && <ProfileDropdown onClose={() => setShowProfileDropdown(false)} />}
            </div>
        </div>
    );
};

/* ================= STYLES ================= */

const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "transparent",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: 20
};

const logoContainer: React.CSSProperties = { cursor: "pointer", display: "flex", alignItems: "center" };
const logoText: React.CSSProperties = { fontSize: 24, fontWeight: "bold", color: "white" };
const navContainer: React.CSSProperties = { display: "flex", gap: 32 };
const navLink: React.CSSProperties = { background: "transparent", border: "none", color: "#b0b0b0", fontSize: 16, cursor: "pointer" };
const actionsContainer: React.CSSProperties = { display: "flex", alignItems: "center", gap: 24, position: "relative" };
const iconWrapper: React.CSSProperties = { cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 };
const profileWrapper: React.CSSProperties = { cursor: "pointer", display: "flex", alignItems: "center", gap: 8 };
const badge: React.CSSProperties = { position: "absolute", top: -2, right: -2, background: "#e74c3c", color: "white", fontSize: 11, fontWeight: "bold", minWidth: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" };

export default DashboardHeader;
