import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import ProfileViewModal from "./ProfileViewModal";

interface Props {
  onClose: () => void;
}

const ProfileDropdown = ({ onClose }: Props) => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Decode token to get current user ID
  const getTokenUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.userId || decoded.sub;
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
    return null;
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };


  return (

    <div style={dropdownStyle} ref={dropdownRef}>
      <div style={itemStyle} onClick={() => handleNavigate("/edit-profile")}>
        Edit Profile
      </div>


      <div style={divider} />
      <div style={divider} />
      <div style={itemStyle} onClick={() => {
        const userId = getTokenUserId();
        if (userId) {
          setCurrentUserId(userId);
          setShowProfileModal(true);
        }
      }}>
        View Profile
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

      {/* Profile View Modal - Reused from Dashboard */}
      <ProfileViewModal
        open={showProfileModal}
        userId={currentUserId}
        onClose={() => setShowProfileModal(false)}
      />
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
