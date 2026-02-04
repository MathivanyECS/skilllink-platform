import { useEffect, useState } from "react";
import api from "../services/api";
import { FaPlus } from "react-icons/fa";
import DashboardHeader from "../components/dashboard/DashboardHeader";
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

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [showWishlist, setShowWishlist] = useState(false);
  const [showWishlistSuccess, setShowWishlistSuccess] = useState(false);

  // Notifications (managed by Header)
  const [unreadCount, setUnreadCount] = useState(0);

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
      <DashboardHeader
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
        showSearch={true}
        searchValue={skill}
        onSearchChange={setSkill}
      />

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

      {/* REQUEST MODAL */}
      <RequestSkillModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />

      {/* PROFILE VIEW MODAL */}
      {selectedUserId && (
        <ProfileViewModal
          userId={selectedUserId}
          isOpen={openProfile}
          onClose={() => setOpenProfile(false)}
        />
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const pageStyle: React.CSSProperties = {
  background: "#1e1e1e",
  minHeight: "100vh",
  color: "white",
  paddingBottom: 40
};

const panelStyle: React.CSSProperties = {
  background: "#2a2626",
  margin: "0 48px 24px",
  padding: "24px 32px",
  borderRadius: 20
};

const selectStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  background: "#3e3a3a",
  color: "white",
  fontSize: 14,
  cursor: "pointer"
};

const clearStyle: React.CSSProperties = {
  color: "#b0b0b0",
  fontSize: 14,
  textDecoration: "underline",
  cursor: "pointer",
  marginTop: 10
};

const wishlistStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #38AE56 0%, #2E8B45 100%)",
  margin: "0 48px 32px",
  padding: "20px 32px",
  borderRadius: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const wishlistBtn: React.CSSProperties = {
  background: "white",
  color: "#38AE56",
  border: "none",
  padding: "12px 24px",
  borderRadius: 12,
  fontWeight: "bold",
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer"
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 24,
  padding: "0 48px"
};

const cardStyle: React.CSSProperties = {
  background: "#2a2626",
  padding: 24,
  borderRadius: 20,
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
};

const nameStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 4
};

const greenBtn: React.CSSProperties = {
  background: "#38AE56",
  border: "none",
  width: "100%",
  padding: "10px",
  borderRadius: 10,
  color: "white",
  fontWeight: "bold",
  marginBottom: 8,
  cursor: "pointer"
};

const grayBtn: React.CSSProperties = {
  background: "#4a4646",
  border: "none",
  width: "100%",
  padding: "10px",
  borderRadius: 10,
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

export default UserDashboard;
