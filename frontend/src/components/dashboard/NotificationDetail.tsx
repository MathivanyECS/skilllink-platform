import api from "../../services/api";
import { Notification } from "./NotificationDrawer";

const NotificationDetail = ({
  notification,
  onClose,
  refresh
}: {
  notification: Notification;
  onClose: () => void;
  refresh: () => void;
}) => {

  const meta = notification.metadata || {};

  // ================== ACTIONS ==================

  const acceptRequest = async () => {
    const requestId = meta.requestId;
    if (!requestId) return;

    await api.put(`/requests/${requestId}/status?status=ACCEPTED`);
    refresh();
    onClose();
  };

  const rejectRequest = async () => {
    const requestId = meta.requestId;
    if (!requestId) return;

    await api.put(`/requests/${requestId}/status?status=REJECTED`);
    refresh();
    onClose();
  };

  // ================== UI ==================

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>{notification.title}</h3>

        {/* ================= PROVIDER VIEW ================= */}
        {notification.type === "NEW_REQUEST" && (
          <>
            <p><strong>Student ID:</strong> {meta.studentId || "-"}</p>
            <p><strong>Student Name:</strong> {meta.studentName || "-"}</p>
            <p><strong>Skill:</strong> {meta.skillName}</p>

            {meta.note && meta.note.trim() !== "" && (
              <p><strong>Message:</strong> {meta.note}</p>
            )}

            <div style={btnRow}>
              <button style={acceptBtn} onClick={acceptRequest}>
                Accept
              </button>

              <button style={rejectBtn} onClick={rejectRequest}>
                Reject
              </button>

              <button style={cancelBtn} onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}

        {/* ================= SEEKER VIEW ================= */}
        {notification.type !== "NEW_REQUEST" && (
          <>
            <p><strong>Provider ID:</strong> {meta.providerId || "-"}</p>
            <p><strong>Provider Name:</strong> {meta.providerName || "-"}</p>
            <p><strong>Skill:</strong> {meta.skillName || "-"}</p>
            <p><strong>Status:</strong> {meta.status || "-"}</p>

            <button style={closeBtn} onClick={onClose}>
              Close
            </button>
          </>
        )}
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
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000
};

const modal = {
  background: "#1e1e1e",
  padding: 24,
  borderRadius: 14,
  width: 440,
  color: "white"
};

const btnRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 24
};

const acceptBtn = {
  background: "#38AE56",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const rejectBtn = {
  background: "#e74c3c",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const cancelBtn = {
  background: "#6a6464",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const closeBtn = {
  marginTop: 20,
  background: "#555",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

export default NotificationDetail;
