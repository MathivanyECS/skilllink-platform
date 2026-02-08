import { useState } from "react";
import api from "../../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WishlistModal = ({ open, onClose, onSuccess }: Props) => {
  const [skillName, setSkillName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!skillName.trim()) return;

    try {
      setLoading(true);
      await api.post("/wishlist", { skillName });
      setSkillName("");
      onClose();
      onSuccess();
    } catch {
      alert("Failed to add wishlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={title}>Add Skill to Wishlist</h2>

        <label style={label}>Skill Name</label>
        <input
          value={skillName}
          onChange={e => setSkillName(e.target.value)}
          style={input}
          placeholder="Enter skill name"
        />

        <p style={hint}>
          You will be notified when a provider adds this skill
        </p>

        <div style={actions}>
          <button style={primaryBtn} onClick={submit} disabled={loading}>
            {loading ? "Adding..." : "Add to Wishlist"}
          </button>
          <button style={secondaryBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000
};

const modal = {
  width: 520,
  backgroundColor: "#0f0f0f",
  padding: "32px",
  borderRadius: 14,

  /* ✅ BORDER + SHADOW */
  border: "1px solid rgba(47,191,113,0.35)",
  boxShadow:
    "0 25px 60px rgba(0,0,0,0.95), inset 0 1px 0 rgba(47,191,113,0.15)",

  color: "#ffffff"
};

const title = {
  margin: 0,
  marginBottom: 24,
  fontSize: 22,
  fontWeight: 600
};

const label = {
  fontSize: 14,
  color: "#cccccc"
};

const input = {
  width: "100%",
  marginTop: 8,
  padding: "12px 14px",
  backgroundColor: "#1a1a1a",
  border: "1px solid #2fbf71",
  borderRadius: 6,
  color: "#ffffff",
  fontSize: 14,
  outline: "none"
};

const hint = {
  marginTop: 12,
  fontSize: 13,
  color: "#9a9a9a"
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
  marginTop: 28
};

const primaryBtn = {
  backgroundColor: "#2fbf71",
  color: "#000",
  border: "none",
  padding: "10px 18px",
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer"
};

const secondaryBtn = {
  backgroundColor: "transparent",
  color: "#cccccc",
  border: "1px solid #333",
  padding: "10px 18px",
  borderRadius: 6,
  fontSize: 14,
  cursor: "pointer"
};

export default WishlistModal;
