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
      <div style={itemStyle} onClick={() => handleNavigate("/edit-profile")}>
        Edit Profile
      </div>

      <div style={itemStyle} onClick={() => handleNavigate("/sessions")}>
        Session Board
      </div>

      <div style={itemStyle} onClick={() => handleNavigate("/collaboration")}>
        Collaboration
      </div>

      <div style={{ ...itemStyle, color: "#ff6b6b" }} onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
};

const dropdownStyle = {
  position: "absolute" as const,
  top: "42px",
  right: 0,
  background: "#2a2323",
  borderRadius: 10,
  width: 200,
  boxShadow: "0 8px 25px rgba(0,0,0,0.8)",
  zIndex: 1000
};

const itemStyle = {
  padding: "12px 16px",
  cursor: "pointer",
  color: "white",
  borderBottom: "1px solid #3b3535"
};

export default ProfileDropdown;
