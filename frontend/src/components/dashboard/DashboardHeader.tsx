import { useState } from "react";
import { FaBell, FaUserCircle, FaChevronDown, FaSearch } from "react-icons/fa";
import logo from "../../assets/images/skilllink-logo.png";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDrawer from "./NotificationDrawer";

interface Props {
    unreadCount?: number;
    setUnreadCount?: (count: number) => void;
    showSearch?: boolean; // We might want to hide search in Collaboration for now
    onSearchChange?: (val: string) => void;
    searchValue?: string;
    customStyle?: React.CSSProperties;
}

const DashboardHeader = ({
    unreadCount = 0,
    setUnreadCount,
    showSearch = false,
    onSearchChange,
    searchValue = "",
    customStyle
}: Props) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div style={{ ...headerStyle, ...customStyle }}>
            <img src={logo} style={{ height: 100 }} alt="SkillLink Logo" />

            {/* Optional Search */}
            <div style={{ ...searchBox, visibility: showSearch ? "visible" : "hidden" }}>
                <FaSearch size={18} color="white" />
                <input
                    placeholder="Search skills..."
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    style={searchInput}
                />
            </div>

            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
                {/* Notification Bell */}
                <div style={{ position: "relative" }}>
                    <FaBell
                        size={22}
                        color="white"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowNotifications(true)}
                    />
                    {unreadCount > 0 && <span style={badge}>{unreadCount}</span>}
                </div>

                {/* Profile Dropdown */}
                <div
                    style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                    onClick={() => setShowProfileMenu(prev => !prev)}
                >
                    <FaUserCircle size={24} color="white" />
                    <FaChevronDown size={14} color="white" />
                </div>

                {showProfileMenu && (
                    <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
                )}
            </div>

            {/* Notification Drawer */}
            <NotificationDrawer
                open={showNotifications}
                onClose={() => setShowNotifications(false)}
                onUnreadCount={setUnreadCount}
            />
        </div>
    );
};

/* ================= STYLES ================= */

const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "28px 48px",
    minHeight: 120
};

const searchBox: React.CSSProperties = {
    background: "#373434",
    padding: "14px 22px",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    width: 520,
    boxShadow: "0 0 0 1px #2f2f2f"
};

const searchInput: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#f5f5f5",          // soft white
    marginLeft: 12,
    width: "100%",
    fontSize: 18,              // slightly bigger
    fontWeight: 500,           // semi-bold
    letterSpacing: "0.4px",    // premium feel
    fontFamily: "Inter, Arial, sans-serif"
};

const badge: React.CSSProperties = {
    position: "absolute",
    top: -6,
    right: -6,
    background: "red",
    color: "white",
    borderRadius: "50%",
    fontSize: 12,
    padding: "2px 6px",
    minWidth: 18,
    textAlign: "center"
};

export default DashboardHeader;
