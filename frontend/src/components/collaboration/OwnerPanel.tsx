/**
 * OwnerPanel Component
 * 
 * Panel shown only to the post owner in the PostDetail view.
 * Allows owner to:
 * - View all applications
 * - Accept/reject applications
 * - Close the post
 * - Delete the post (with confirmation)
 */

import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaLock, FaTrash, FaUser } from "react-icons/fa";
import { CollaborationApplication } from "../../types/collaboration.types";
import * as collaborationService from "../../services/collaborationService";

interface Props {
  postId: string;
  applications: CollaborationApplication[];
  onApplicationUpdate: () => void;
  onPostUpdate: () => void;
  onPostDelete: () => void;
}

const OwnerPanel = ({
  postId,
  applications,
  onApplicationUpdate,
  onPostUpdate,
  onPostDelete
}: Props) => {
  const [loading, setLoading] = useState<string | null>(null); // Track which action is loading
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle accept/reject application
  const handleRespondToApplication = async (
    applicationId: string,
    accept: boolean
  ) => {
    try {
      setLoading(applicationId);
      await collaborationService.respondToApplication(postId, applicationId, accept);
      toast.success(
        `Application ${accept ? "accepted" : "rejected"} successfully`
      );
      onApplicationUpdate();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to respond to application";
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  // Handle close post
  const handleClosePost = async () => {
    try {
      setLoading("close");
      await collaborationService.closePost(postId);
      toast.success("Post closed successfully");
      onPostUpdate();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to close post";
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  // Handle delete post
  const handleDeletePost = async () => {
    try {
      setLoading("delete");
      await collaborationService.deletePost(postId);
      toast.success("Post deleted successfully");
      onPostDelete();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete post";
      toast.error(errorMessage);
    } finally {
      setLoading(null);
      setShowDeleteConfirm(false);
    }
  };

  // Note: Applicant names would need to be fetched from user service
  // For now, we display the applicant ID. This can be enhanced later
  // to fetch and display full names from the user service.

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get status badge style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return { background: "#38AE56", color: "white" };
      case "REJECTED":
        return { background: "#e74c3c", color: "white" };
      default:
        return { background: "#6a6464", color: "white" };
    }
  };

  return (
    <div style={panelStyle}>
      <h3 style={panelTitle}>Applications Management</h3>

      {/* Applications List */}
      <div style={applicationsContainer}>
        {applications.length === 0 ? (
          <p style={emptyState}>No applications yet</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} style={applicationCard}>
              <div style={applicationHeader}>
                <div style={applicantInfo}>
                  <FaUser size={16} style={{ marginRight: 8 }} />
                  <span style={{ fontWeight: "bold" }}>
                    Applicant ID: {app.applicantId.substring(0, 8)}...
                  </span>
                </div>
                <span
                  style={{
                    ...statusBadge,
                    ...getStatusStyle(app.status)
                  }}
                >
                  {app.status}
                </span>
              </div>

              {app.message && (
                <p style={applicationMessage}>{app.message}</p>
              )}

              <div style={applicationFooter}>
                <span style={dateText}>
                  Applied: {formatDate(app.appliedAt)}
                </span>
                {app.status === "PENDING" && (
                  <div style={actionButtons}>
                    <button
                      style={acceptBtn}
                      onClick={() =>
                        handleRespondToApplication(app.id, true)
                      }
                      disabled={loading === app.id}
                    >
                      <FaCheck size={14} />
                      Accept
                    </button>
                    <button
                      style={rejectBtn}
                      onClick={() =>
                        handleRespondToApplication(app.id, false)
                      }
                      disabled={loading === app.id}
                    >
                      <FaTimes size={14} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Management Actions */}
      <div style={actionsSection}>
        <h4 style={actionsTitle}>Post Actions</h4>
        <div style={actionButtonsRow}>
          <button
            style={closeBtn}
            onClick={handleClosePost}
            disabled={loading === "close"}
          >
            <FaLock size={14} />
            Close Post
          </button>
          <button
            style={deleteBtn}
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading === "delete"}
          >
            <FaTrash size={14} />
            Delete Post
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={confirmOverlay}>
          <div style={confirmModal}>
            <h4 style={confirmTitle}>Delete Post?</h4>
            <p style={confirmMessage}>
              This action cannot be undone. The post and all applications will be
              permanently deleted.
            </p>
            <div style={confirmActions}>
              <button
                style={confirmDeleteBtn}
                onClick={handleDeletePost}
                disabled={loading === "delete"}
              >
                {loading === "delete" ? "Deleting..." : "Delete"}
              </button>
              <button
                style={cancelBtn}
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading === "delete"}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const panelStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #2a2323, #1a1414)",
  padding: 24,
  borderRadius: 14,
  marginTop: 24
};

const panelTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 20,
  color: "white"
};

const applicationsContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginBottom: 24
};

const applicationCard: React.CSSProperties = {
  background: "#3b3535",
  padding: 20,
  borderRadius: 12,
  border: "1px solid #2a2323"
};

const applicationHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12
};

const applicantInfo: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  color: "white",
  fontSize: 14
};

const statusBadge: React.CSSProperties = {
  padding: "4px 12px",
  borderRadius: 12,
  fontSize: 11,
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const applicationMessage: React.CSSProperties = {
  color: "#d0d0d0",
  fontSize: 14,
  lineHeight: 1.6,
  marginBottom: 12,
  fontStyle: "italic"
};

const applicationFooter: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: 12,
  borderTop: "1px solid #2a2323"
};

const dateText: React.CSSProperties = {
  fontSize: 12,
  color: "#888",
  opacity: 0.7
};

const actionButtons: React.CSSProperties = {
  display: "flex",
  gap: 8
};

const acceptBtn: React.CSSProperties = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: 6
};

const rejectBtn: React.CSSProperties = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: 6
};

const actionsSection: React.CSSProperties = {
  paddingTop: 20,
  borderTop: "1px solid #2a2323"
};

const actionsTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 12,
  color: "white"
};

const actionButtonsRow: React.CSSProperties = {
  display: "flex",
  gap: 12
};

const closeBtn: React.CSSProperties = {
  background: "#6a6464",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: 8,
  flex: 1
};

const deleteBtn: React.CSSProperties = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: 8,
  flex: 1
};

const emptyState: React.CSSProperties = {
  textAlign: "center",
  color: "#888",
  padding: "40px 0",
  fontSize: 14
};

const confirmOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3000
};

const confirmModal: React.CSSProperties = {
  background: "#1f1f1f",
  padding: 24,
  borderRadius: 12,
  width: 400,
  maxWidth: "90vw",
  color: "white"
};

const confirmTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 12,
  color: "white"
};

const confirmMessage: React.CSSProperties = {
  fontSize: 14,
  color: "#d0d0d0",
  marginBottom: 20,
  lineHeight: 1.6
};

const confirmActions: React.CSSProperties = {
  display: "flex",
  gap: 12,
  justifyContent: "flex-end"
};

const confirmDeleteBtn: React.CSSProperties = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "bold"
};

const cancelBtn: React.CSSProperties = {
  background: "#6a6464",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "bold"
};

export default OwnerPanel;
