import api from "../../services/api";

interface Props {
  open: boolean;
  notification: any;
  onClose: () => void;
  onUpdated: () => void;
}

const NotificationDetailModal = ({
  open,
  notification,
  onClose,
  onUpdated
}: Props) => {
  if (!open || !notification) return null;

  const meta = notification.metadata || {};

  // NEW REQUEST HANDLERS
  const handleAccept = async () => {
    await api.put(`/requests/${meta.requestId}/status?status=ACCEPTED`);
    onUpdated();
    onClose();
  };

  const handleReject = async () => {
    await api.put(`/requests/${meta.requestId}/status?status=REJECTED`);
    onUpdated();
    onClose();
  };

  const closeAndRead = async () => {
    await api.put(`/notifications/${notification.id}/read`);
    onUpdated();
    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modal}>

        {/* 🔔 PROVIDER VIEW – NEW REQUEST */}
        {notification.type === "NEW_REQUEST" && (
          <>
            <h2>Incoming Skill Request</h2>
            <p><strong>Student ID:</strong> {meta.studentId || "-"}</p>
            <p><strong>Student Name:</strong> {meta.studentName || "-"}</p>
            <p><strong>Skill:</strong> {meta.skillName}</p>
            {meta.note && <p><strong>Message:</strong> {meta.note}</p>}

            <div style={btnRow}>
              <button style={acceptBtn} onClick={handleAccept}>Accept</button>
              <button style={rejectBtn} onClick={handleReject}>Reject</button>
              <button style={cancelBtn} onClick={closeAndRead}>Cancel</button>
            </div>
          </>
        )}

        {/* 👩‍🎓 SEEKER VIEW – ACCEPTED / REJECTED */}
        {(notification.type === "REQUEST_ACCEPTED" ||
          notification.type === "REQUEST_REJECTED") && (
          <>
            <h2>Request Status Update</h2>

            <p><strong>Skill:</strong> {meta.skillName || "-"}</p>

            <p>
              <strong>Provider ID:</strong>{" "}
              {meta.providerStudentId || meta.providerId || "-"}
            </p>

            <p>
              <strong>Provider Name:</strong>{" "}
              {meta.providerName || "-"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    meta.status === "ACCEPTED"
                      ? "#38AE56"
                      : "#e74c3c"
                }}
              >
                {meta.status || "-"}
              </span>
            </p>

            <div style={btnRow}>
              <button style={cancelBtn} onClick={closeAndRead}>OK</button>
            </div>
          </>
        )}

        {/* 💚 WISHLIST */}
        {notification.type === "WISHLIST_CREATED" && (
          <>
            <h2>Wishlist Added</h2>
            <p><strong>Skill:</strong> {meta.skillName || "-"}</p>

            <div style={btnRow}>
              <button style={cancelBtn} onClick={closeAndRead}>OK</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

/* ===== STYLES ===== */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000
};

const modal = {
  background: "#1f1f1f",
  padding: 24,
  borderRadius: 14,
  width: 420,
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
  border: "none",
  padding: "12px 22px",
  borderRadius: 8,
  cursor: "pointer"
};

const rejectBtn = {
  background: "#a14444",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: 8,
  cursor: "pointer"
};

const cancelBtn = {
  background: "#6a6464",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: 8,
  cursor: "pointer"
};

export default NotificationDetailModal;
