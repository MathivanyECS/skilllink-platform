/**
 * ApplyModal Component
 * 
 * Modal for users to apply to a collaboration post.
 * Requires authentication - shows login prompt if user is not logged in.
 * Handles form submission and success/error states.
 */

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { applyToPost } from "../../services/collaborationService";
import { CollabApplicationDTO } from "../../types/collaboration.types";

interface Props {
  open: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  onSuccess?: () => void;
}

const ApplyModal = ({ open, onClose, postId, postTitle, onSuccess }: Props) => {
  const auth = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // Check if user is logged in
  const isAuthenticated = !!user && !!localStorage.getItem("token");

  // Handle login redirect
  const handleLoginRedirect = () => {
    onClose();
    navigate("/login", { state: { returnTo: `/collaboration/${postId}` } });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      handleLoginRedirect();
      return;
    }

    try {
      setLoading(true);

      const dto: CollabApplicationDTO = {
        message: message.trim() || undefined
      };

      await applyToPost(postId, dto);

      toast.success("Application submitted successfully!");
      setMessage("");
      onClose();
      // Ensure specific onSuccess logic (refetch) is decoupled from this execution frame
      setTimeout(() => onSuccess?.(), 0);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to submit application";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>Apply to Collaboration</h2>
        <p style={subtitleStyle}>{postTitle}</p>

        {/* Not authenticated - show login prompt */}
        {!isAuthenticated ? (
          <div style={loginPrompt}>
            <p style={{ marginBottom: 16, opacity: 0.9 }}>
              Please log in to apply to this collaboration opportunity.
            </p>
            <div style={buttonGroup}>
              <button style={greenBtn} onClick={handleLoginRedirect}>
                Go to Login
              </button>
              <button style={grayBtn} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated - show application form */
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>
              Message (Optional)
              <span style={{ opacity: 0.6, fontSize: 13, marginLeft: 6 }}>
                Tell the owner why you're interested
              </span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={textarea}
              placeholder="I'm interested in this collaboration because..."
              rows={6}
              maxLength={500}
            />
            <div style={charCount}>
              {message.length}/500 characters
            </div>

            <div style={actions}>
              <button
                type="submit"
                style={greenBtn}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
              <button
                type="button"
                style={grayBtn}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

/* ================= STYLES ================= */
// Matching the design pattern from dashboard modals

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000
};

const modal: React.CSSProperties = {
  width: 520,
  maxWidth: "90vw",
  background: "#1f1f1f",
  padding: 28,
  borderRadius: 16,
  color: "white",
  boxShadow: "0 0 40px rgba(0,0,0,0.8)"
};

const titleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: 8,
  color: "white"
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 16,
  color: "#38AE56",
  marginBottom: 24,
  opacity: 0.9
};

const loginPrompt: React.CSSProperties = {
  textAlign: "center",
  padding: "20px 0"
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 500,
  color: "white"
};

const textarea: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #38AE56",
  background: "#4a4444",
  color: "white",
  fontSize: 14,
  fontFamily: "inherit",
  resize: "vertical" as const,
  marginBottom: 8
};

const charCount: React.CSSProperties = {
  fontSize: 12,
  color: "#888",
  textAlign: "right" as const,
  marginBottom: 20
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 24
};

const greenBtn: React.CSSProperties = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 15,
  fontWeight: "bold",
  flex: 1,
  transition: "background 0.2s"
};

const buttonGroup: React.CSSProperties = {
  display: "flex",
  gap: 12,
  justifyContent: "center"
};

const grayBtn: React.CSSProperties = {
  background: "#6a6464",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 15,
  fontWeight: "bold",
  flex: 1
};

export default ApplyModal;
