import { useEffect, useState } from "react";
import api from "../services/api";
import { FaPlus, FaBell, FaUserCircle, FaChevronDown, FaSearch } from "react-icons/fa";
import logo from "../assets/images/skilllink-logo.png";
import ProfileDropdown from "../components/dashboard/ProfileDropdown";
import NotificationDrawer from "../components/dashboard/NotificationDrawer";
import WishlistModal from "../components/dashboard/WishlistModal";
import WishlistSuccessModal from "../components/dashboard/WishlistSuccessModal";
import RequestSkillModal from "../components/dashboard/RequestSkillModal";
import ProfileViewModal from "../components/dashboard/ProfileViewModal"; 

interface Profile {
  userId: string;
  fullName: string;
  department: string;
  yearOfStudy: number;
  profileImageUrl?: string;
}

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

  const [unreadCount, setUnreadCount] = useState(0);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showWishlistSuccess, setShowWishlistSuccess] = useState(false);

  

  useEffect(() => {
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

  const avatarStyle = (imageUrl?: string) => ({
    width: 56,
    height: 56,
    borderRadius: "50%",
    backgroundImage: `url(${imageUrl || defaultAvatar})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginBottom: 14
  });

  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <img src={logo} style={{ height: 100 }} />

        <div style={searchBox}>
          <FaSearch size={18} color="white" />
          <input
placeholder="Search skills you want to learn…"
            value={skill}
            onChange={e => setSkill(e.target.value)}
            style={searchInput}
          />
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <FaBell
              size={22}
              color="white"
              style={{ cursor: "pointer" }}
              onClick={() => setShowNotifications(true)}
            />
            {unreadCount > 0 && <span style={badge}>{unreadCount}</span>}
          </div>

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
      </div>

      {/* FILTER BAR */}
      <div style={panelStyle}>
        <h2>Find Skill Providers</h2>

        <div style={{ display: "flex", gap: 15 }}>
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
        {profiles.map(p => (
          <div key={p.userId} style={cardStyle}>
            <div style={avatarStyle(p.profileImageUrl)} />

            <h3 style={nameStyle}>{p.fullName}</h3>
            <p>{p.department}</p>
            <p>{formatYear(p.yearOfStudy)}</p>
            <p>Rating: {(ratings[p.userId] ?? 0).toFixed(1)} / 5.0</p>

            <div style={{ marginTop: 16 }}>
              <button style={greenBtn} onClick={() => setShowRequestModal(true)}>
                Request Skill
              </button>

              <button
                style={grayBtn}
                onClick={() => {
                  setSelectedUserId(p.userId); // ✅ FIXED
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

const badge = {
  position: "absolute" as const,
  top: -6,
  right: -6,
  background: "red",
  color: "white",
  borderRadius: "50%",
  fontSize: 12,
  padding: "2px 6px",
  minWidth: 18,
  textAlign: "center" as const
};

const pageStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #1e1e1e, #000)",
  color: "white",
  fontFamily: "Arial, sans-serif"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "28px 48px",
  minHeight: 120
};


const searchBox = {
  background: "#373434",
  padding: "14px 22px",
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  width: 520,
  boxShadow: "0 0 0 1px #2f2f2f"
};


const searchInput = {
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



const panelStyle = {
  margin: "20px 40px",
  background: "linear-gradient(180deg, #2a2323, #1a1414)",
  padding: 22,
  borderRadius: 12
};

const selectStyle = {
  background: "#3a3636",
  color: "#f5f5f5",
  border: "none",
  padding: "14px 52px 14px 18px",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: "0.3px",
  cursor: "pointer",

  appearance: "none" as any,
  WebkitAppearance: "none" as any,
  MozAppearance: "none" as any,

  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='white'><path d='M6 9l6 6 6-6z'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 18px center",
  backgroundSize: "20px"
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
