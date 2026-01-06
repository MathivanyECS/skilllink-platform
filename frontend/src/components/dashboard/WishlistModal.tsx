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

      await api.post("/wishlist", {
        skillName
      });

      setSkillName("");
      onClose();
      onSuccess(); // ✅ open success popup

    } catch (err) {
      alert("Failed to add wishlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Add Skill to Wishlist</h2>

        <label style={{ marginTop: 16 }}>Skill Name</label>
        <input
          value={skillName}
          onChange={e => setSkillName(e.target.value)}
          style={input}
          placeholder="Enter skill name"
        />

        <p style={{ opacity: 0.7, marginTop: 12 }}>
          You will be notified when a provider adds this skill
        </p>

        <div style={actions}>
          <button style={greenBtn} onClick={submit} disabled={loading}>
            {loading ? "Adding..." : "Add to Wishlist"}
          </button>
          <button style={grayBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* styles */
const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000
};

const modal = {
  width: 420,
  background: "#1f1f1f",
  padding: 24,
  borderRadius: 14,
  color: "white",
  boxShadow: "0 0 40px rgba(0,0,0,0.8)"
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 6,
  border: "none",
  background: "#4a4444",
  color: "white",
  marginTop: 8
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 24
};

const greenBtn = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: 6,
  cursor: "pointer"
};

const grayBtn = {
  background: "#6a6464",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: 6,
  cursor: "pointer"
};

export default WishlistModal;
