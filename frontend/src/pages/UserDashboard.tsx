import { useEffect, useState } from "react";
import api from "../services/api";
import { FaPlus, FaSearch } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

import ProfileDropdown from "../components/dashboard/ProfileDropdown";
import NotificationDrawer from "../components/dashboard/NotificationDrawer";
import WishlistModal from "../components/dashboard/WishlistModal";
import WishlistSuccessModal from "../components/dashboard/WishlistSuccessModal";
import RequestSkillModal from "../components/dashboard/RequestSkillModal";
import ProfileViewModal from "../components/dashboard/ProfileViewModal";
import TopNavigationBar from "../components/layout/TopNavigationBar";

interface Profile {
  userId: string;
  fullName: string;
  department: string;
  yearOfStudy: number;
  profilePicture?: string;
  studentId?: string; // ✅ Added studentId
  skillsToTeach?: Skill[]; // ✅ Updated to array of objects
}

// ✅ Define Skill interface
interface Skill {
  skillName: string;
  proficiency?: string;
  yearsOfExperience?: number;
}
const BACKEND_URL = "http://localhost:8081";

const UserDashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [skill, setSkill] = useState("");

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Profile | null>(null); // ✅ Track selected provider

  const [unreadCount, setUnreadCount] = useState(0);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showWishlistSuccess, setShowWishlistSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Decode token to get current user ID
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setCurrentUserId(decoded.userId || decoded.sub); // Adjust based on token structure
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
    fetchProfiles();
  }, [department, year, skill]);

  const fetchProfiles = async () => {
    const params: any = {};
    if (department) params.department = department;
    if (year) params.year = year;
    if (skill) params.skill = skill;

    const res = await api.get("/profiles", { params });
    setProfiles(res.data);

    res.data.forEach((p: Profile) => {
      api
        .get(`/reviews/user/${p.userId}/average-rating`)
        .then(r =>
          setRatings(prev => ({ ...prev, [p.userId]: r.data ?? 0 }))
        );
    });
  };

  const clearFilters = () => {
    setDepartment("");
    setYear("");
    setSkill("");
  };

  const formatYear = (y?: number) => (y ? `Year ${y}` : "");

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const avatarStyle = (profilePicture?: string) => {
    const imageUrl =
      profilePicture && profilePicture.startsWith("/")
        ? `${BACKEND_URL}${profilePicture}`
        : profilePicture || defaultAvatar;

    return {
      width: 56,
      height: 56,
      borderRadius: "50%",
      backgroundImage: `url("${imageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginBottom: 14
    };
  };


  return (
    <div style={pageStyle}>
      {/* TOP NAV */}
      <TopNavigationBar
        active="dashboard"
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={() => setShowProfileMenu(prev => !prev)}
      />

      {showProfileMenu && (
        <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
      )}

      {/* SEARCH + FILTER ROW */}
      <div style={filterRow}>
        <div style={searchBoxWide}>
          <FaSearch size={18} color="#ddd" />
          <input
            placeholder="Search skills you want to learn…"
            value={skill}
            onChange={e => setSkill(e.target.value)}
            style={searchInput}
          />
        </div>

        <select value={department} onChange={e => setDepartment(e.target.value)} style={selectStyle}>
          <option value="">All Departments</option>
          <option>Computer Science</option>
          <option>Electronics</option>
          <option>Chemistry</option>
          <option>Industrial Management</option>
          <option>Mathematics</option>
          <option>Microbiology</option>
          <option>Physics</option>
          <option>Plant and Molecular biology</option>
          <option>Zoology and Environmental Management</option>
          <option>Statistics</option>
        </select>

        <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle}>
          <option value="">Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <span style={clearStyle} onClick={clearFilters}>
          Clear Filters
        </span>
      </div>

      {/* WISHLIST */}
      <div style={wishlistStyle}>
        <div>
          <h4>Can’t find a provider?</h4>
          <p style={{ opacity: 0.7 }}>
            Add skills to your wishlist and get notified when provider becomes available
          </p>
        </div>

        <button style={wishlistBtn} onClick={() => setShowWishlist(true)}>
          <FaPlus size={22} />
          Add to Wishlist
        </button>

        <WishlistModal
          open={showWishlist}
          onClose={() => setShowWishlist(false)}
          onSuccess={() => setShowWishlistSuccess(true)}
        />

        <WishlistSuccessModal
          open={showWishlistSuccess}
          onClose={() => setShowWishlistSuccess(false)}
        />
      </div>

      {/* CARDS */}
      <div style={gridStyle}>
        {profiles
          .filter(p => p.userId !== currentUserId) // ✅ Filter logged-in user
          .map(p => (
            <div key={p.userId} style={cardStyle}>
              <div style={avatarStyle(p.profilePicture)} />
              <h3 style={nameStyle}>{p.fullName}</h3>
              <p>{p.department}</p>
              <p>{formatYear(p.yearOfStudy)}</p>
              <p>Rating: {(ratings[p.userId] ?? 0).toFixed(1)} / 5.0</p>

              <div style={{ marginTop: 16 }}>
                <button style={greenBtn} onClick={() => {
                  setSelectedProvider(p); // ✅ Set selected provider
                  setShowRequestModal(true);
                }}>
                  Request Skill
                </button>

                <button
                  style={grayBtn}
                  onClick={() => {
                    setSelectedUserId(p.userId);
                    setOpenProfile(true);
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
      </div>

      <RequestSkillModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={() => alert("Request sent successfully")}
        providerId={selectedProvider?.userId || ""} // ✅ Pass providerId (UUID) for API
        providerStudentId={selectedProvider?.studentId || "N/A"} // ✅ Pass Student ID for Display
        availableSkills={selectedProvider?.skillsToTeach?.map(s => s.skillName) || []} // ✅ Extract skill names
      />

      <ProfileViewModal
        open={openProfile}
        userId={selectedUserId}
        onClose={() => setOpenProfile(false)}
      />

      <NotificationDrawer
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        onUnreadCount={setUnreadCount}
      />
    </div>
  );
};

/* ================= STYLES ================= */

const GREEN = "#38AE56";

const pageStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #1c1c1c, #000)",
  color: "white",
  fontFamily: "Arial, sans-serif"
};

const filterRow = {
  margin: "28px 40px",
  padding: 22,
  display: "flex",
  alignItems: "center",
  gap: 16,
  background: "linear-gradient(180deg, #242020, #171414)",
  borderRadius: 16,
  boxShadow: "0 0 22px rgba(0,0,0,0.6)"
};

const searchBoxWide = {
  flex: 1,
  background: "#3a3636",
  padding: "14px 22px",
  borderRadius: 14,
  display: "flex",
  alignItems: "center"
};

const searchInput = {
  background: "transparent",
  border: "none",
  outline: "none",
  color: "#f5f5f5",
  marginLeft: 12,
  width: "100%",
  fontSize: 17,
  fontWeight: 500,
  letterSpacing: "0.3px"
};

const selectStyle = {
  background: "#3a3636",
  color: "#f5f5f5",
  border: "none",
  padding: "14px 18px",
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer"
};

const clearStyle = {
  marginLeft: "auto",
  color: GREEN,
  cursor: "pointer",
  fontWeight: "bold"
};

const wishlistStyle = {
  margin: "20px 40px",
  background: "linear-gradient(180deg, #2a2323, #1a1414)",
  padding: 22,
  borderRadius: 14,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const wishlistBtn = {
  background: GREEN,
  border: "none",
  padding: "16px 28px",
  color: "white",
  borderRadius: 14,
  fontSize: 20,
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: 14,
  cursor: "pointer"
};

const gridStyle = {
  margin: "36px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 32
};

const cardStyle = {
  background: "#3b3535",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 0 25px rgba(0,0,0,0.7)"
};

const nameStyle = {
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 6
};

const greenBtn = {
  background: GREEN,
  border: "none",
  padding: "10px 18px",
  color: "white",
  borderRadius: 8,
  marginRight: 10,
  cursor: "pointer"
};

const grayBtn = {
  background: "#6a6464",
  border: "none",
  padding: "10px 18px",
  color: "white",
  borderRadius: 8,
  cursor: "pointer"
};

export default UserDashboard;
