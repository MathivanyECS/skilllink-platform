import { FaBell, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import logo from "../../assets/images/skilllink-logo.png";

interface Props {
  active: "login" | "dashboard" | "collaboration" | "sessions";
  onNotificationClick: () => void;
  onProfileClick: () => void;
}

const GREEN = "#38AE56";
const BACKEND_URL = "http://localhost:8081";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const TopNavigationBar = ({
  active,
  onNotificationClick,
  onProfileClick
}: Props) => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // ✅ LOAD LOGGED-IN USER PROFILE IMAGE
  useEffect(() => {
    api.get("/profiles/me")
      .then(res => {
        setProfilePicture(res.data.profilePicture);
      })
      .catch(() => {
        setProfilePicture(null);
      });
  }, []);



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
      : "none"
  });

  return (
    <div style={wrapper}>
      {/* LEFT */}
      <div style={leftGroup}>
        <img
          src={logo}
          style={logoStyle}
          onClick={() => navigate("/")}
        />

        <div
          style={navItemStyle(active === "login")}
          onClick={() => navigate("/login")}
        >
          Login
        </div>

        <div
          style={navItemStyle(active === "dashboard")}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </div>

        <div
          style={navItemStyle(active === "sessions")}
          onClick={() => navigate("/sessions")}
        >
          Session Board
        </div>

        <div
          style={navItemStyle(active === "collaboration")}
          onClick={() => navigate("/collaboration")}
        >
          Collaboration
        </div>
      </div>

      {/* RIGHT */}
      <div style={rightGroup}>
        <FaBell
          size={24}
          color="white"
          style={{ cursor: "pointer" }}
          onClick={onNotificationClick}
        />

        <div
          style={{ display: "flex", alignItems: "center", gap: 8 }}
          onClick={onProfileClick}
        >
          {/* ✅ REAL PROFILE IMAGE */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundImage: `url(${profilePicture
                ? `${BACKEND_URL}${profilePicture}`
                : DEFAULT_AVATAR
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

/* STYLES */
const wrapper = {
  width: "100%",
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 56px",
  background: "linear-gradient(180deg, #151515, #090909)"
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
  height: 78,
  cursor: "pointer"
};

export default TopNavigationBar;
