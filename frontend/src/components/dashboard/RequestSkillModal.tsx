import { useState } from "react";
import api from "../../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RequestSkillModal = ({ open, onClose, onSuccess }: Props) => {
  const [providerStudentId, setProviderStudentId] = useState("");
  const [skillName, setSkillName] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const sendRequest = async () => {
    if (!providerStudentId.trim() || !skillName.trim()) {
      alert("Provider ID and Skill Name are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/requests", {
        providerId: providerStudentId, // ✅ STUDENT ID entered by user
        skillName,
        note
      });

      setProviderStudentId("");
      setSkillName("");
      setNote("");

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

        {/* ✅ USER ENTERS PROVIDER STUDENT ID */}
        <label>Provider Student ID</label>
        <input
          value={providerStudentId}
          onChange={e => setProviderStudentId(e.target.value)}
          style={input}
          placeholder="Enter provider student ID"
        />

        <label>Skill Name</label>
        <input
          value={skillName}
          onChange={e => setSkillName(e.target.value)}
          style={input}
          placeholder="Enter skill name"
        />

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
