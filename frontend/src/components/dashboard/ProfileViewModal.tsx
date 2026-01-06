import api from "../../services/api";
import { useEffect, useState } from "react";
import { FaUserGraduate, FaEnvelope, FaStar } from "react-icons/fa";

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
        <h2 style={name}>{profile.fullName}</h2>

        {/* BASIC INFO */}
        <div style={section}>
          <p><strong>🎓 Student ID:</strong> {profile.studentId || "-"}</p>
          <p><strong>🏫 Department:</strong> {profile.department}</p>
          <p><strong>📚 Year of Study:</strong> Year {profile.yearOfStudy}</p>
          <p>
            <FaEnvelope /> <strong>Email:</strong> {profile.email}
          </p>
        </div>

        <hr style={divider} />

        {/* SKILLS */}
        <div style={section}>
          <h4>📖 Skills to Learn</h4>
          <p>{profile.skillsToLearn?.join(", ") || "-"}</p>

          <h4 style={{ marginTop: 12 }}>🎯 Skills to Teach</h4>
          <p>
            {profile.skillsToTeach?.map((s: any) => s.skillName).join(", ") || "-"}
          </p>
        </div>

        <hr style={divider} />

        {/* RATING */}
        <div style={ratingBox}>
          <FaStar color="#f5c542" size={22} />
          <span style={{ marginLeft: 8, fontSize: 18 }}>
            {rating.toFixed(1)} / 5.0
          </span>
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

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000
};

const modal = {
  width: 520,
  background: "linear-gradient(180deg,#2a2323,#1a1414)",
  borderRadius: 16,
  padding: 28,
  color: "white",
  boxShadow: "0 0 40px rgba(0,0,0,0.9)"
};

const name = {
  fontSize: 28,
  fontWeight: "bold",
  marginBottom: 12
};

const section = {
  fontSize: 16,
  lineHeight: 1.8
};

const divider = {
  borderColor: "#444",
  margin: "16px 0"
};

const ratingBox = {
  display: "flex",
  alignItems: "center",
  marginBottom: 20
};

const doneBtn = {
  background: "#6a6464",
  border: "none",
  padding: "12px 28px",
  color: "white",
  borderRadius: 10,
  fontSize: 16,
  cursor: "pointer"
};

export default ProfileViewModal;
