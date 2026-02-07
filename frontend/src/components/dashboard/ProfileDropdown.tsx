import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

const ProfileDropdown = ({ onClose }: Props) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={dropdownStyle}>
      <div style={itemStyle} onClick={() => handleNavigate("/profile")}>
        Edit Profile
      </div>


      <div style={divider} />

      <div style={itemStyle} onClick={() => handleNavigate("/sessions")}>
        Session Board
      </div>

      <div style={divider} />

      <div style={itemStyle} onClick={() => handleNavigate("/collaboration")}>
        Collaboration
      </div>

      <div style={divider} />

      <div style={{ ...itemStyle, ...logoutStyle }} onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const dropdownStyle = {
  position: "absolute" as const,
  top: "44px",
  right: 0,
  width: 220,
  background: "linear-gradient(180deg, #2b2525, #1f1a1a)",
  borderRadius: 14,
  boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
  overflow: "hidden",
  zIndex: 1000
};

const itemStyle = {
  padding: "14px 18px",
  cursor: "pointer",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: "0.3px"
};

const divider = {
  height: 1,
  background: "rgba(255,255,255,0.08)"
};

const logoutStyle = {
  color: "#ff6b6b",
  fontWeight: 600
};

export default ProfileDropdown;
