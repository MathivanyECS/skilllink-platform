/**
 * PostCard Component
 * 
 * Reusable card component for displaying collaboration posts in the feed.
 * Shows essential information: title, description preview, skills, status, and owner info.
 * Clicking the card navigates to the post detail view.
 */

import { useNavigate } from "react-router-dom";
import { CollaborationPost } from "../../types/collaboration.types";
import { FaClock, FaTag } from "react-icons/fa";

interface Props {
  post: CollaborationPost;
  isOwner?: boolean;
  onApply?: (post: CollaborationPost) => void;
  onClose?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onView?: (postId: string) => void;
  onViewApps?: (postId: string) => void;
}

const PostCard = ({ post, isOwner, onApply, onClose, onDelete, onView, onViewApps }: Props) => {
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return "#38AE56"; // Green
      case "CLOSED":
        return "#6a6464"; // Gray
      case "FILLED":
        return "#4a90e2"; // Blue
      default:
        return "#6a6464";
    }
  };

  // Truncate description for preview
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking buttons
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    navigate(`/collaboration/${post.id}`);
  };

  return (
    <div
      style={{
        ...cardStyle,
        borderLeft: isOwner ? "4px solid #38AE56" : "1px solid transparent",
        background: isOwner ? "linear-gradient(145deg, #3b3535, #2f2a2a)" : "#3b3535"
      }}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 30px rgba(56, 174, 86, 0.3)";
        if (!isOwner) e.currentTarget.style.border = "1px solid #38AE56";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 0 25px rgba(0,0,0,0.7)";
        if (!isOwner) e.currentTarget.style.border = "1px solid transparent";
      }}
    >
      {/* Header with title and status */}
      <div style={headerStyle}>
        <h3 style={titleStyle}>{post.title}</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isOwner && (
            <span style={ownerBadge}>
              My Post
            </span>
          )}
          <span
            style={{
              ...statusBadge,
              background: getStatusColor(post.status)
            }}
          >
            {post.status}
          </span>
        </div>
      </div>

      {/* Category badge */}
      <div style={categoryStyle}>
        <FaTag size={12} />
        <span style={{ marginLeft: 6, textTransform: "capitalize" }}>{post.category.toLowerCase()}</span>
      </div>

      {/* Description preview */}
      <p style={descriptionStyle}>{truncateDescription(post.description)}</p>

      {/* Required skills */}
      {post.requiredSkills && post.requiredSkills.length > 0 && (
        <div style={skillsContainer}>
          {post.requiredSkills.slice(0, 4).map((skill, idx) => (
            <span key={idx} style={skillBadge}>
              {skill}
            </span>
          ))}
          {post.requiredSkills.length > 4 && (
            <span style={skillBadge}>+{post.requiredSkills.length - 4} more</span>
          )}
        </div>
      )}

      {/* Footer with duration/date AND Actions */}
      <div style={footerStyle}>
        <div style={footerItem}>
          <FaClock size={14} />
          <span style={{ marginLeft: 6 }}>{post.duration || formatDate(post.createdAt)}</span>
        </div>

        <div style={actionsContainer}>
          {isOwner ? (
            <>
              <button style={actionBtnPrimary} onClick={(e) => { e.stopPropagation(); onViewApps?.(post.id); }}>View Apps</button>
              <button style={actionBtnSecondary} onClick={(e) => { e.stopPropagation(); onClose?.(post.id); }}>Close</button>
              <button style={actionBtnDanger} onClick={(e) => { e.stopPropagation(); onDelete?.(post.id); }}>Delete</button>
            </>
          ) : (
            <>
              <button style={actionBtnOutline} onClick={(e) => { e.stopPropagation(); onView?.(post.id); }}>Details</button>
              {post.status === "OPEN" && (
                <button style={actionBtnSuccess} onClick={(e) => { e.stopPropagation(); onApply?.(post); }}>Apply</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */
// Following the same design pattern as dashboard components

const cardStyle: React.CSSProperties = {
  background: "#3b3535",
  padding: 24,
  borderRadius: 14,
  boxShadow: "0 0 25px rgba(0,0,0,0.7)",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s, border 0.2s",
  border: "1px solid transparent",
  display: "flex",
  flexDirection: "column",
  minHeight: 280
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 12
};

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: "bold",
  color: "white",
  margin: 0,
  flex: 1,
  marginRight: 12
};

const statusBadge: React.CSSProperties = {
  padding: "4px 12px",
  borderRadius: 12,
  fontSize: 11,
  fontWeight: "bold",
  color: "white",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const categoryStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  color: "#38AE56",
  fontSize: 13,
  fontWeight: 500,
  marginBottom: 12
};

const descriptionStyle: React.CSSProperties = {
  color: "#d0d0d0",
  fontSize: 14,
  lineHeight: 1.6,
  marginBottom: 16,
  flex: 1 // Push footer down
};

const skillsContainer: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 20
};

const skillBadge: React.CSSProperties = {
  background: "#2a2323",
  color: "#38AE56",
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 500,
  border: "1px solid #38AE56"
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: 16,
  borderTop: "1px solid #2a2323",
  marginTop: "auto"
};

const footerItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  color: "#b0b0b0",
  fontSize: 13
};

const ownerBadge: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 11,
  fontWeight: "bold",
  color: "#d0d0d0",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const actionsContainer: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center"
};

const btnBase: React.CSSProperties = {
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: "bold",
  cursor: "pointer",
  transition: "opacity 0.2s"
};

const actionBtnPrimary: React.CSSProperties = {
  ...btnBase,
  background: "#4a90e2",
  color: "white"
};

const actionBtnSuccess: React.CSSProperties = {
  ...btnBase,
  background: "#38AE56", // Green
  color: "white"
};

const actionBtnOutline: React.CSSProperties = {
  ...btnBase,
  background: "transparent",
  border: "1px solid #666",
  color: "#ccc"
};

const actionBtnSecondary: React.CSSProperties = {
  ...btnBase,
  background: "#666",
  color: "white"
};

const actionBtnDanger: React.CSSProperties = {
  ...btnBase,
  background: "#e74c3c", // Red
  color: "white"
};

export default PostCard;
