import { FaBell, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/skilllink-logo.png";

interface Props {
  active: "login" | "dashboard" | "collaboration" | "sessions";
  onNotificationClick: () => void;
  onProfileClick: () => void;
}

const GREEN = "#38AE56";

const TopNavigationBar = ({
  active,
  onNotificationClick,
  onProfileClick
}: Props) => {
  const navigate = useNavigate();

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
        {/* ✅ BIG BRAND LOGO */}
        <img
          src={logo}
          style={logoStyle}
          onClick={() => navigate("/")}
        />

        {/* LOGIN */}
        <div
          style={navItemStyle(active === "login")}
          onClick={() => navigate("/login")}
        >
          Login
        </div>

        {/* DASHBOARD */}
        <div
          style={navItemStyle(active === "dashboard")}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </div>

        {/* SESSION BOARD */}
        <div
          style={navItemStyle(active === "sessions")}
          onClick={() => navigate("/sessions")}
        >
          Session Board
        </div>

        {/* COLLABORATION */}
        <div
          style={navItemStyle(active === "collaboration")}
          onClick={() => navigate("/collaboration")}
        >
          Collaboration
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={rightGroup}>
        <FaBell
          size={24}
          color="white"
          style={{ cursor: "pointer" }}
          onClick={onNotificationClick}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer"
          }}
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

const wrapper = {
  width: "100%",
  height: 96, // ⬅ taller navbar (premium feel)
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 56px",
  background: "linear-gradient(180deg, #151515, #090909)",
  borderBottom: "1px solid #1f1f1f"
};

const leftGroup = {
  display: "flex",
  alignItems: "center",
  gap: 38
};

const rightGroup = {
  display: "flex",
  alignItems: "center",
  gap: 26
};

const logoStyle = {
  height: 78,            // ✅ MUCH BIGGER
  cursor: "pointer",
  objectFit: "contain" as const
};

export default TopNavigationBar;
