import { useEffect, useState } from "react";
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
  const [status, setStatus] = useState<"PENDING" | "ACCEPTED" | "REJECTED">(
    "PENDING"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (notification?.metadata?.requestId) {
      // 🔥 FETCH LATEST STATUS TO PREVENT DUPLICATE RESPONSE
      api.get(`/requests/${notification.metadata.requestId}`)
        .then(res => {
          if (res.data && res.data.status) {
            setStatus(res.data.status);
          }
        })
        .catch(() => {
          // fallback to metadata status if fetch fails
          if (notification?.metadata?.status) {
            setStatus(notification.metadata.status);
          }
        });
    } else if (notification?.metadata?.status) {
      setStatus(notification.metadata.status);
    }
  }, [notification]);

  if (!open || !notification) return null;

  const meta = notification.metadata || {};

  const handleAccept = async () => {
    try {
      setLoading(true);
      await api.put(`/requests/${meta.requestId}/status?status=ACCEPTED`);
      setStatus("ACCEPTED");
      // 🔥 Trigger update immediately to remove notification from list if needed
      onUpdated();
    } catch (err) {
      console.error("Accept failed", err);
      // 🔥 Refetch status in case it was already processed
      fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await api.put(`/requests/${meta.requestId}/status?status=REJECTED`);
      setStatus("REJECTED");
      onUpdated();
    } catch (err) {
      console.error("Reject failed", err);
      fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = () => {
    if (meta.requestId) {
      api.get(`/requests/${meta.requestId}`)
        .then(res => {
          if (res.data && res.data.status) {
            setStatus(res.data.status);
          }
        })
        .catch(e => console.error("Fetch status failed", e));
    }
  };

  const closeAndRead = async () => {
    await api.put(`/notifications/${notification.id}/read`);
    onUpdated();
    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modal}>

        {/* ================= NEW REQUEST (PROVIDER) ================= */}
        {notification.type === "NEW_REQUEST" && (
          <>
            <h2>Incoming Skill Request</h2>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 15 }}>
              {(() => {
                try {
                  return new Date(notification.createdAt).toLocaleString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  });
                } catch (e) {
                  return "Invalid Date";
                }
              })()}
            </p>
            <p><strong>Student ID:</strong> {meta.studentId || "-"}</p>
            <p><strong>Student Name:</strong> {meta.studentName || "-"}</p>
            <p><strong>Skill:</strong> {meta.skillName || "-"}</p>
            {meta.note && <p><strong>Message:</strong> {meta.note}</p>}

            {/* 🔥 Check LOCAL status state, not just meta logic */}
            {status === "PENDING" && (
              <div style={btnRow}>
                <button style={acceptBtn} onClick={handleAccept} disabled={loading}>
                  {loading ? "Processing..." : "Accept"}
                </button>
                <button style={rejectBtn} onClick={handleReject} disabled={loading}>
                  {loading ? "Processing..." : "Reject"}
                </button>
                <button style={cancelBtn} onClick={closeAndRead} disabled={loading}>
                  Cancel
                </button>
              </div>
            )}

            {status !== "PENDING" && (
              <>
                <p style={{
                  marginTop: 20,
                  fontWeight: 600,
                  color: status === "ACCEPTED" ? "#38AE56" : "#e74c3c"
                }}>
                  Request has been {status.toLowerCase()}.
                </p>

                <div style={btnRow}>
                  <button style={cancelBtn} onClick={closeAndRead}>
                    OK
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ================= REQUEST SENT (SEEKER) ================= */}
        {notification.type === "REQUEST_SENT" && (
          <>
            <h2>Request Sent</h2>
            <p style={{ marginTop: 10 }}>
              Your request for <strong>{meta.skillName || "-"}</strong> was sent.
            </p>
            <div style={btnRow}>
              <button style={acceptBtn} onClick={closeAndRead}>
                OK
              </button>
            </div>
          </>
        )}

        {/* ================= ACCEPT / REJECT (SEEKER) ================= */}
        {(notification.type === "REQUEST_ACCEPTED" ||
          notification.type === "REQUEST_REJECTED") && (
            <>
              <h2>Request Status Update</h2>
              <p><strong>Skill:</strong> {meta.skillName || "-"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: meta.status === "ACCEPTED" ? "#38AE56" : "#e74c3c" }}>
                  {meta.status}
                </span>
              </p>
              <div style={btnRow}>
                <button style={cancelBtn} onClick={closeAndRead}>
                  OK
                </button>
              </div>
            </>
          )}

        {/* ================= WISHLIST (UI ENHANCED ONLY) ================= */}
        {notification.type === "WISHLIST_CREATED" && (
          <>
            <h1 style={wishlistTitle}>Wishlist Added</h1>

            <p style={wishlistSub}>Skill</p>

            <p style={wishlistSkill}>
              {meta.skillName || "-"}
            </p>

            <div style={wishlistBtnRow}>
              <button style={wishlistOkBtn} onClick={closeAndRead}>
                OK
              </button>
            </div>
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
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000
};

const modal = {
  background: "#0f0f0f",
  padding: 32,
  borderRadius: 18,
  width: 460,
  color: "white",
  border: "2px solid #38AE56",
  boxShadow: "0 25px 70px rgba(0,0,0,0.9)",
  animation: "popup 0.3s ease-out"
};

const btnRow = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 24
};

const acceptBtn = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "12px 26px",
  borderRadius: 10,
  cursor: "pointer"
};

const rejectBtn = {
  background: "#a14444",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: 10,
  cursor: "pointer"
};

const cancelBtn = {
  background: "#6a6464",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: 10,
  cursor: "pointer"
};

/* ===== Wishlist UI styles ===== */

const wishlistTitle = {
  textAlign: "center" as const,
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 10
};

const wishlistSub = {
  textAlign: "center" as const,
  fontSize: 14,
  opacity: 0.7
};

const wishlistSkill = {
  textAlign: "center" as const,
  fontSize: 22,
  fontWeight: 600,
  color: "#38AE56",
  marginTop: 6
};

const wishlistBtnRow = {
  display: "flex",
  justifyContent: "center",
  marginTop: 30
};

const wishlistOkBtn = {
  background: "#38AE56",
  color: "#000",
  border: "none",
  padding: "12px 38px",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer"
};

/* ===== Animation ===== */
const style = document.createElement("style");
style.innerHTML = `
@keyframes popup {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
`;
document.head.appendChild(style);

export default NotificationDetailModal;
