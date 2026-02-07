import api from "../../services/api";
import { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import { getReviewsByUser } from "../../services/reviewService";
import { getProfileById } from "../../services/profileService";
import { Review } from "../../types/review.types";

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

const GREEN = "#38AE56";

const ProfileViewModal = ({ open, userId, onClose }: Props) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewerNames, setReviewerNames] = useState<Record<string, string>>({});

  const getProfileImageUrl = () => {
    if (!profile?.profilePicture) return DEFAULT_AVATAR;
    if (profile.profilePicture.startsWith("http")) return profile.profilePicture;
    return `${BACKEND_URL}${profile.profilePicture}`;
  };

  useEffect(() => {
    if (!open) {
      setProfile(null);
      setRating(0);
      setReviews([]);
    }
  }, [open]);

  useEffect(() => {
    if (open && userId) {
      api.get(`/profiles/${userId}`).then(res => setProfile(res.data));
      api.get(`/reviews/user/${userId}/average-rating`)
        .then(r => setRating(r.data ?? 0));

      getReviewsByUser(userId).then(async data => {
        setReviews(data);
        setReviewCount(data.length);

        const uniqueReviewerIds = Array.from(
          new Set(data.map(r => r.reviewerId))
        );

        const names: Record<string, string> = {};
        await Promise.all(uniqueReviewerIds.map(async id => {
          try {
            const p = await getProfileById(id);
            names[id] = p.fullName;
          } catch {
            names[id] = "Unknown Student";
          }
        }));

        setReviewerNames(names);
      });
    }
  }, [open, userId]);

  if (!open || !profile) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>

        {/* PROFILE IMAGE */}
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

        {/* SKILLS TO LEARN */}
        <div style={section}>
          <h3 style={sectionTitle}>Skills to Learn</h3>
          <div style={pillBox}>
            {profile.skillsToLearn?.length
              ? profile.skillsToLearn.map(s => (
                <span key={s} style={pill}>{s}</span>
              ))
              : <span style={muted}>Not specified</span>}
          </div>
        </div>

        {/* SKILLS TO TEACH */}
        <div style={section}>
          <h3 style={sectionTitle}>Skills to Teach</h3>
          <div style={pillBox}>
            {profile.skillsToTeach?.length
              ? profile.skillsToTeach.map(s => (
                <span key={s.skillName} style={pill}>{s.skillName}</span>
              ))
              : <span style={muted}>Not specified</span>}
          </div>
        </div>

        {/* RATING */}
        <div style={ratingBox}>
          <div>
            <span style={ratingValue}>{rating.toFixed(1)}</span>
            <span style={ratingOutOf}> / 5.0</span>
          </div>
          <span style={reviewCountStyle}>({reviewCount} reviews)</span>
        </div>

        {/* REVIEWS */}
        <div style={section}>
          <h3 style={sectionTitle}>Recent Reviews</h3>
          <div style={reviewsContainer}>
            {reviews.length ? reviews.map(review => (
              <div key={review.id} style={reviewCard}>
                <div style={reviewHeader}>
                  <div style={reviewerInfo}>
                    <div style={avatarParams}>
                      <User size={14} />
                    </div>
                    <span style={reviewerName}>
                      {reviewerNames[review.reviewerId] || "Loading..."}
                    </span>
                  </div>
                  <div style={starRow}>
                    <Star size={12} className="fill-yellow-500 text-yellow-500" />
                    <span style={starVal}>{review.rating}</span>
                  </div>
                </div>
                <p style={reviewText}>{review.reviewText}</p>
              </div>
            )) : <p style={muted}>No reviews yet.</p>}
          </div>
        </div>

        <button style={doneBtn} onClick={onClose}>DONE</button>
      </div>
    </div>
  );
};

/* SMALL COMPONENT */
const Info = ({ label, value }: any) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
    <span style={{ opacity: 0.7 }}>{label}</span>
    <span style={{ fontWeight: 600 }}>{value}</span>
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

const name = { fontSize: 32, color: GREEN, marginBottom: 22 };
const infoBox = { marginBottom: 26 };

const section = { marginBottom: 24 };
const sectionTitle = { fontSize: 18, fontWeight: 600, color: GREEN, marginBottom: 10 };

const pillBox = { display: "flex", flexWrap: "wrap" as const, gap: 10 };
const pill = { background: "rgba(56,174,86,0.15)", padding: "6px 14px", borderRadius: 20 };
const muted = { opacity: 0.6, fontSize: 14 };

const ratingBox = { fontSize: 22, display: "flex", gap: 12, marginBottom: 28 };
const ratingValue = { color: GREEN };
const ratingOutOf = { opacity: 0.6 };
const reviewCountStyle = { fontSize: 14, opacity: 0.6 };

const reviewsContainer = { display: "flex", flexDirection: "column" as const, gap: 12 };
const reviewCard = { background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8 };
const reviewHeader = { display: "flex", justifyContent: "space-between" };
const reviewerInfo = { display: "flex", gap: 8, alignItems: "center" };
const avatarParams = { width: 24, height: 24, borderRadius: "50%", background: "#444", display: "flex", alignItems: "center", justifyContent: "center" };
const reviewerName = { fontSize: 13, fontWeight: 600 };
const starRow = { display: "flex", gap: 4 };
const starVal = { fontSize: 13, fontWeight: 700, color: "#FFCA28" };
const reviewText = { fontSize: 13, color: "#bbb" };

const doneBtn = {
  width: "100%",
  padding: "14px",
  background: GREEN,
  border: "none",
  borderRadius: 14,
  fontWeight: 700
};

export default ProfileViewModal;
