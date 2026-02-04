import api from "../../services/api";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  userId: string | null;
  onClose: () => void;
}

const ProfileViewModal = ({ open, userId, onClose }: Props) => {
  const [profile, setProfile] = useState<any>(null);
  const [rating, setRating] = useState(0);

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
      <div style={modal}>

        {/* HEADER */}
        <h1 style={name}>{profile.fullName}</h1>

        {/* BASIC INFO */}
        <div style={infoBox}>
          <div style={row}>
            <span style={label}>Student ID</span>
            <span style={value}>{profile.studentId || "-"}</span>
          </div>

          <div style={row}>
            <span style={label}>Department</span>
            <span style={value}>{profile.department}</span>
          </div>

          <div style={row}>
            <span style={label}>Year of Study</span>
            <span style={value}>Year {profile.yearOfStudy}</span>
          </div>

          <div style={row}>
            <span style={label}>Email</span>
            <span style={email}>{profile.email}</span>
          </div>
        </div>

        {/* SKILLS */}
        <div style={section}>
          <h3 style={sectionTitle}>Skills to Learn</h3>
          <div style={pillBox}>
            {profile.skillsToLearn?.length
              ? profile.skillsToLearn.map((s: string) => (
                  <span key={s} style={pill}>{s}</span>
                ))
              : <span style={muted}>Not specified</span>}
          </div>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>Skills to Teach</h3>
          <div style={pillBox}>
            {profile.skillsToTeach?.length
              ? profile.skillsToTeach.map((s: any) => (
                  <span key={s.skillName} style={pill}>{s.skillName}</span>
                ))
              : <span style={muted}>Not specified</span>}
          </div>
        </div>

        {/* RATING */}
        <div style={ratingBox}>
          <span style={ratingValue}>{rating.toFixed(1)}</span>
          <span style={ratingOutOf}> / 5.0</span>
        </div>

        {/* ACTION */}
        <button style={doneBtn} onClick={onClose}>
          DONE
        </button>

      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const GREEN = "#38AE56";

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
  background: "linear-gradient(180deg,#1f1f1f,#121212)",
  borderRadius: 20,
  padding: "32px 36px",
  color: "white",
  boxShadow: "0 0 50px rgba(0,0,0,0.95)"
};

const name = {
  fontSize: 32,
  fontWeight: 700,
  color: GREEN,
  marginBottom: 22
};

const infoBox = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: 14,
  padding: 20,
  marginBottom: 26
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 12
};

const label = {
  fontSize: 14,
  opacity: 0.7
};

const value = {
  fontSize: 15,
  fontWeight: 600
};

const email = {
  fontSize: 15,
  fontWeight: 500,
  color: "#e0e0e0"
};

const section = {
  marginBottom: 24
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: 600,
  color: GREEN,
  marginBottom: 10
};

const pillBox = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 10
};

const pill = {
  background: "rgba(56,174,86,0.15)",
  color: "#c8f5d6",
  padding: "6px 14px",
  borderRadius: 20,
  fontSize: 14
};

const muted = {
  opacity: 0.6,
  fontSize: 14
};

const ratingBox = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 28
};

const ratingValue = {
  color: GREEN
};

const ratingOutOf = {
  opacity: 0.6
};

const doneBtn = {
  width: "100%",
  padding: "14px 0",
  background: GREEN,
  border: "none",
  borderRadius: 14,
  color: "white",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer"
};

export default ProfileViewModal;
