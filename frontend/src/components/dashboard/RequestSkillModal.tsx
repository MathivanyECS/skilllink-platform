import { useState, useEffect } from "react";
import api from "../../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId: string; // ✅ UUID for API
  providerStudentId: string; // ✅ Student ID for Display
  availableSkills: string[]; // ✅ Receive available skills
}

const RequestSkillModal = ({ open, onClose, onSuccess, providerId, providerStudentId, availableSkills }: Props) => {
  const [skillName, setSkillName] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSkillName("");
      setNote("");
    }
  }, [open]);

  if (!open) return null;

  const sendRequest = async () => {
    if (!providerId || !skillName.trim()) {
      alert("Skill Name is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/requests", {
        providerId, // ✅ Use passed providerId (UUID)
        skillName,
        note
      });

      onClose();
      onSuccess();

    } catch (err) {
      alert("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Request Skill</h2>
        <p style={{ opacity: 0.7 }}>
          Send a learning request to connect with a skill provider
        </p>

        {/* ✅ USER SEES READ-ONLY PROVIDER ID */}
        <label>Provider Student ID</label>
        <input
          value={providerStudentId}
          disabled
          style={{ ...input, opacity: 0.6, cursor: "not-allowed" }}
        />

        <label>Skill Name</label>
        {/* ✅ DROPDOWN FOR SKILLS */}
        <select
          value={skillName}
          onChange={e => setSkillName(e.target.value)}
          style={input} // Use same style as input
        >
          <option value="">Select a skill...</option>
          {availableSkills && availableSkills.length > 0 ? (
            availableSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))
          ) : (
            <option disabled>No skills available</option>
          )}
        </select>

        <label>Message / Note</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          style={textarea}
          placeholder="Optional message"
        />

        <div style={actions}>
          <button style={greenBtn} onClick={sendRequest} disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </button>
          <button style={grayBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===== SAME STYLE AS WISHLIST POPUP ===== */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.45)", // ✅ NOT full black
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000
};

const modal = {
  width: 460,
  background: "#1f1f1f",
  padding: 26,
  borderRadius: 16,
  color: "white",
  boxShadow: "0 0 40px rgba(0,0,0,0.8)"
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 6,
  border: "1px solid #38AE56",
  background: "#4a4444",
  color: "white",
  marginTop: 6,
  marginBottom: 14
};

const textarea = {
  ...input,
  height: 80
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 20
};

const greenBtn = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "10px 22px",
  borderRadius: 6,
  cursor: "pointer"
};

const grayBtn = {
  background: "#6a6464",
  color: "white",
  border: "none",
  padding: "10px 22px",
  borderRadius: 6,
  cursor: "pointer"
};

export default RequestSkillModal;
