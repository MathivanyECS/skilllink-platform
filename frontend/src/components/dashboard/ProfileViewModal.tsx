import api from "../../services/api";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  userId: string | null;
  onClose: () => void;
}
interface Profile {
  id: string;
  fullName: string;
  studentId?: string;
  email: string;
  department: string;
  yearOfStudy: number;
  profilePicture?: string;
  skillsToLearn?: string[];
  skillsToTeach?: { skillName: string }[];
}

const BACKEND_URL = "http://localhost:8081";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ProfileViewModal = ({ open, userId, onClose }: Props) => {
  const [profile, setProfile] = useState<Profile | null>(null);


  const [rating, setRating] = useState(0);

  const getProfileImageUrl = (): string => {
    if (!profile?.profilePicture) return DEFAULT_AVATAR;

    if (profile.profilePicture.startsWith("http")) {
      return profile.profilePicture;
    }

    return `${BACKEND_URL}${profile.profilePicture}`;
  };

  // ✅ RESET STATE WHEN USER CHANGES
  useEffect(() => {
    if (!open) {
      setProfile(null);
      setRating(0);
    }
  }, [open]);

  useEffect(() => {
    if (open && userId) {
      api.get(`/profiles/${userId}`).then(res => setProfile(res.data));
      api.get(`/reviews/user/${userId}/average-rating`)
        .then(r => setRating(r.data ?? 0));
    }
  }, [open, userId]);

  if (!open || !profile) return null;

  return (
    <div style={overlay}>
      <div style={modal} key={profile.id}>
        {/* ✅ PROFILE IMAGE */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            margin: "0 auto 20px",
            backgroundImage: `url(${getProfileImageUrl()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "3px solid #38AE56"
          }}
        />

        <h1 style={name}>{profile.fullName}</h1>

        <div style={infoBox}>
          <Info label="Student ID" value={profile.studentId || "-"} />
          <Info label="Department" value={profile.department} />
          <Info label="Year" value={`Year ${profile.yearOfStudy}`} />
          <Info label="Email" value={profile.email} />
        </div>

        <Section title="Skills to Learn" items={profile.skillsToLearn} />
        <Section
          title="Skills to Teach"
          items={profile.skillsToTeach?.map((s: any) => s.skillName)}
        />

        <div style={ratingBox}>
          <span style={ratingValue}>{rating.toFixed(1)}</span>
          <span style={ratingOutOf}> / 5.0</span>
        </div>

        <button style={doneBtn} onClick={onClose}>
          DONE
        </button>
      </div>
    </div>
  );
};

/* SMALL COMPONENTS */
const Info = ({ label, value }: any) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
    <span style={{ opacity: 0.7 }}>{label}</span>
    <span style={{ fontWeight: 600 }}>{value}</span>
  </div>
);

const Section = ({ title, items }: any) => (
  <div style={{ marginBottom: 22 }}>
    <h3 style={{ color: "#38AE56" }}>{title}</h3>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {items?.length
        ? items.map((i: string) => (
          <span key={i} style={pill}>{i}</span>
        ))
        : <span style={{ opacity: 0.6 }}>Not specified</span>}
    </div>
  </div>
);

/* STYLES */
const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000
};

const modal = {
  width: 560,
  background: "#121212",
  borderRadius: 20,
  padding: "32px 36px",
  color: "white"
};

const name = { fontSize: 32, color: "#38AE56", marginBottom: 22 };
const infoBox = { marginBottom: 26 };
const pill = {
  background: "rgba(56,174,86,0.15)",
  padding: "6px 14px",
  borderRadius: 20
};
const ratingBox = { fontSize: 22, marginBottom: 28 };
const ratingValue = { color: "#38AE56" };
const ratingOutOf = { opacity: 0.6 };
const doneBtn = {
  width: "100%",
  padding: "14px",
  background: "#38AE56",
  border: "none",
  borderRadius: 14,
  fontWeight: 700
};

export default ProfileViewModal;
