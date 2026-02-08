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
      api.get(`/requests/${notification.metadata.requestId}`)
        .then(res => {
          if (res.data && res.data.status) {
            setStatus(res.data.status);
          }
        })
        .catch(() => {
          if (notification?.metadata?.status) {
            setStatus(notification.metadata.status);
          }
        });
    } else if (notification?.metadata?.status) {
      setStatus(notification.metadata.status);
    }
  }, [notification]);

  if (!open || !notification) return null;

  const meta = notification?.metadata || {};

  const wishlistSkillName =
    meta.skillName ||
    meta.wishlistSkill ||
    meta.skill ||
    "Your wishlist skill";


  const handleAccept = async () => {
    try {
      setLoading(true);
      await api.put(`/requests/${meta.requestId}/status?status=ACCEPTED`);
      setStatus("ACCEPTED");
      onUpdated();
    } catch {
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
    } catch {
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
        });
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
            <h2 style={title}>Incoming Skill Request</h2>

            <p style={dateText}>
              {new Date(notification.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>

            <div style={infoBox}>
              <div>
                <span style={label}>Student ID</span>
                <span style={value}>{meta.studentId || "-"}</span>
              </div>

              <div>
                <span style={label}>Student Name</span>
                <span style={value}>{meta.studentName || "-"}</span>
              </div>

              <div>
                <span style={label}>Skill</span>
                <span style={skillValue}>{meta.skillName || "-"}</span>
              </div>

              {meta.note && (
                <div style={messageBox}>
                  <span style={label}>Message</span>
                  <p style={messageText}>{meta.note}</p>
                </div>
              )}
            </div>

            {status === "PENDING" && (
              <div style={buttonRow}>
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
              <div style={centerBtnRow}>
                <button style={cancelBtn} onClick={closeAndRead}>
                  OK
                </button>
              </div>
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
            <div style={centerBtnRow}>
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
              <h2 style={statusTitle}>Request Status Update</h2>

              <p style={statusSkill}>{meta.skillName || "-"}</p>

              <p
                style={{
                  ...statusValue,
                  color: meta.status === "ACCEPTED" ? "#38AE56" : "#e74c3c"
                }}
              >
                {meta.status}
              </p>

              <div style={centerBtnRow}>
                <button style={cancelBtn} onClick={closeAndRead}>
                  OK
                </button>
              </div>
            </>
          )}
        {/* ================= WISHLIST ================= */}

        {notification.type === "WISHLIST_CREATED" && (
          <>
            <h1 style={wishlistTitle}>Wishlist Added</h1>
            <p style={wishlistSub}>Skill</p>
            <p style={wishlistSkill}>{wishlistSkillName}</p>

            <div style={wishlistBtnRow}>
              <button style={wishlistOkBtn} onClick={closeAndRead}>
                OK
              </button>
            </div>
          </>
        )}



        {/* ================= WISHLIST MATCH FOUND ================= */}
        {
          notification.type === "WISHLIST_AVAILABLE" && (
            <>
              <h1 style={wishlistTitle}>Wishlist Added</h1>
              <p style={wishlistSub}>Skill</p>
              <p style={wishlistSkill}>{meta.skillName || "Your wishlist skill"}</p>

              <p
                style={{
                  textAlign: "center",
                  marginTop: 12,
                  fontSize: 15,
                  opacity: 0.8
                }}
              >
                A provider is now available for a skill in your wishlist.
              </p>
              <div style={wishlistBtnRow}>

                <button style={wishlistOkBtn} onClick={closeAndRead}>
                  OK
                </button>
              </div>
            </>
          )
        }

      </div >
    </div >
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
  padding: 34,
  borderRadius: 22,
  width: 500,
  color: "white",
  border: "2px solid #38AE56",
  boxShadow: "0 25px 70px rgba(0,0,0,0.9)",
  animation: "popup 0.3s ease-out"
};

const title = {
  fontSize: 26,
  fontWeight: 700
};

const dateText = {
  fontSize: 13,
  color: "#888",
  marginBottom: 22
};

const infoBox = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 14,
  marginBottom: 28
};

const label = {
  display: "block",
  fontSize: 12,
  color: "#999",
  marginBottom: 2
};

const value = {
  fontSize: 16,
  fontWeight: 500
};

const skillValue = {
  fontSize: 20,
  fontWeight: 700,
  color: "#38AE56"
};

const messageBox = {
  background: "rgba(255,255,255,0.05)",
  padding: 12,
  borderRadius: 10
};

const messageText = {
  marginTop: 4,
  fontSize: 15,
  opacity: 0.9
};

const buttonRow = {
  display: "flex",
  justifyContent: "center",
  gap: 18,
  marginTop: 24
};

const centerBtnRow = {
  display: "flex",
  justifyContent: "center",
  marginTop: 28
};

const acceptBtn = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "14px 34px",
  borderRadius: 12,
  fontSize: 16,
  cursor: "pointer"
};

const rejectBtn = {
  background: "#a14444",
  color: "white",
  border: "none",
  padding: "14px 34px",
  borderRadius: 12,
  fontSize: 16,
  cursor: "pointer"
};

const cancelBtn = {
  background: "#6a6464",
  color: "white",
  border: "none",
  padding: "14px 34px",
  borderRadius: 12,
  fontSize: 16,
  cursor: "pointer"
};

/* ===== Status UI ===== */

const statusTitle = {
  textAlign: "center" as const,
  fontSize: 26,
  fontWeight: 700,
  marginBottom: 12
};

const statusSkill = {
  textAlign: "center" as const,
  fontSize: 22,
  fontWeight: 600,
  marginBottom: 8
};

const statusValue = {
  textAlign: "center" as const,
  fontSize: 24,
  fontWeight: 800
};

/* ===== Wishlist UI ===== */

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
        from {opacity: 0; transform: scale(0.9); }
      to {opacity: 1; transform: scale(1); }
}
      `;
document.head.appendChild(style);

export default NotificationDetailModal;
