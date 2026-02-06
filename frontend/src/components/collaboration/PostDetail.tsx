/**
 * PostDetail Component
 * 
 * Full view of a single collaboration post.
 * Shows all post details, allows users to apply, and shows owner panel if user is the owner.
 * Handles loading and error states.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaArrowLeft, FaTag, FaClock, FaUser, FaCalendar } from "react-icons/fa";
import { useCollaborationPost, usePostApplications } from "../../hooks/useCollaboration";
import ApplyModal from "./ApplyModal";
import OwnerPanel from "./OwnerPanel";
import toast from "react-hot-toast";
import api from "../../services/api";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const { post, loading, error, refetch } = useCollaborationPost(postId || null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const { applications, refetch: refetchApplications } = usePostApplications(
    isOwner ? (postId || null) : null
  );

  // Check if current user is the owner
  useEffect(() => {
    const checkOwnership = async () => {
      if (post) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            // Try to get user ID from user object first
            if (user && (user as any).id) {
              setIsOwner(post.createdBy === (user as any).id);
              return;
            }

            // If user object doesn't have ID, fetch from API
            const response = await api.get("/auth/me");
            const currentUser = response.data;
            setIsOwner(post.createdBy === currentUser.id);
          } catch (error) {
            // If not authenticated, user is not owner
            setIsOwner(false);
          }
        } else {
          setIsOwner(false);
        }
      }
    };

    checkOwnership();
  }, [post, user]);

  // Handle post update (after close/delete)
  const handlePostUpdate = () => {
    refetch();
    refetchApplications();
  };

  // Handle post delete (navigate back to feed)
  const handlePostDelete = () => {
    navigate("/collaboration");
    toast.success("Post deleted successfully");
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return "#38AE56";
      case "CLOSED":
        return "#6a6464";
      case "FILLED":
        return "#4a90e2";
      default:
        return "#6a6464";
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingStyle}>Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={pageStyle}>
        <div style={errorStyle}>
          <p>{error || "Post not found"}</p>
          <button style={backBtn} onClick={() => navigate("/collaboration")}>
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Back button */}
      <button style={backButton} onClick={() => navigate("/collaboration")}>
        <FaArrowLeft size={18} />
        Back to Feed
      </button>

      {/* Main content */}
      <div style={container}>
        {/* Header */}
        <div style={header}>
          <div style={headerTop}>
            <h1 style={title}>{post.title}</h1>
            <span
              style={{
                ...statusBadge,
                background: getStatusColor(post.status)
              }}
            >
              {post.status}
            </span>
          </div>

          <div style={metaInfo}>
            <div style={metaItem}>
              <FaTag size={14} />
              <span>{post.category}</span>
            </div>
            {post.duration && (
              <div style={metaItem}>
                <FaClock size={14} />
                <span>{post.duration}</span>
              </div>
            )}
            <div style={metaItem}>
              <FaCalendar size={14} />
              <span>Posted {formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={section}>
          <h3 style={sectionTitle}>Description</h3>
          <p style={description}>{post.description}</p>
        </div>

        {/* Required Skills */}
        {post.requiredSkills && post.requiredSkills.length > 0 && (
          <div style={section}>
            <h3 style={sectionTitle}>Required Skills</h3>
            <div style={skillsContainer}>
              {post.requiredSkills.map((skill, idx) => (
                <span key={idx} style={skillBadge}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button (only if not owner and post is open) */}
        {!isOwner && post.status === "OPEN" && (
          <div style={section}>
            <button
              style={applyButton}
              onClick={() => setShowApplyModal(true)}
            >
              Apply to This Collaboration
            </button>
          </div>
        )}

        {/* Owner Panel (only if user is owner) */}
        {isOwner && (
          <OwnerPanel
            postId={post.id}
            applications={applications}
            onApplicationUpdate={refetchApplications}
            onPostUpdate={handlePostUpdate}
            onPostDelete={handlePostDelete}
          />
        )}

        {/* Closed/Not Owner Message */}
        {!isOwner && post.status !== "OPEN" && (
          <div style={closedMessage}>
            <p>This collaboration post is {post.status.toLowerCase()}.</p>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <ApplyModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        postId={post.id}
        postTitle={post.title}
        onSuccess={() => {
          refetch();
          refetchApplications();
        }}
      />
    </div>
  );
};

/* ================= STYLES ================= */

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #1e1e1e, #000)",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: "40px 20px"
};

const loadingStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  fontSize: 18,
  color: "#b0b0b0"
};

const errorStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  fontSize: 16,
  color: "#e74c3c"
};

const backButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "transparent",
  border: "1px solid #38AE56",
  color: "#38AE56",
  padding: "10px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "bold",
  marginBottom: 24,
  marginLeft: 20
};

const backBtn: React.CSSProperties = {
  ...backButton,
  marginTop: 20
};

const container: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  background: "linear-gradient(180deg, #2a2323, #1a1414)",
  padding: 32,
  borderRadius: 16
};

const header: React.CSSProperties = {
  marginBottom: 32,
  paddingBottom: 24,
  borderBottom: "1px solid #2a2323"
};

const headerTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 16
};

const title: React.CSSProperties = {
  fontSize: 32,
  fontWeight: "bold",
  color: "white",
  margin: 0,
  flex: 1,
  marginRight: 16
};

const statusBadge: React.CSSProperties = {
  padding: "6px 16px",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: "bold",
  color: "white",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const metaInfo: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
  color: "#b0b0b0",
  fontSize: 14
};

const metaItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8
};

const section: React.CSSProperties = {
  marginBottom: 32
};

const sectionTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 12,
  color: "white"
};

const description: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.8,
  color: "#d0d0d0"
};

const skillsContainer: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12
};

const skillBadge: React.CSSProperties = {
  background: "#2a2323",
  color: "#38AE56",
  padding: "10px 18px",
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 500,
  border: "1px solid #38AE56"
};

const applyButton: React.CSSProperties = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "16px 32px",
  borderRadius: 10,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
  transition: "background 0.2s"
};

const closedMessage: React.CSSProperties = {
  textAlign: "center",
  padding: "40px 20px",
  background: "#2a2323",
  borderRadius: 12,
  color: "#888",
  fontSize: 16
};

export default PostDetail;
