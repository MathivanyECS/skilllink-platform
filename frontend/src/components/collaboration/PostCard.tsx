import { useNavigate } from "react-router-dom";
import { FaTag, FaClock, FaCheckCircle, FaTrash, FaBan, FaListAlt } from "react-icons/fa";
import { CollaborationPost } from "../../types/collaboration.types";
import { closePost, deletePost } from "../../services/collaborationService";
import toast from "react-hot-toast";

interface PostCardProps {
    post: CollaborationPost;
    isOwner?: boolean;
    onViewApplications?: () => void;
    onUpdate?: () => void;
    onOpen?: () => void;
    currentUserId?: string | null;
    applicationStatus?: string;
}

const PostCard = ({ post, isOwner, onViewApplications, onUpdate, onOpen, currentUserId, applicationStatus }: PostCardProps) => {
    const navigate = useNavigate();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN": return "#38AE56";
            case "CLOSED": return "#e74c3c";
            case "FILLED": return "#4a90e2";
            default: return "#6a6464";
        }
    };

    const handleClose = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to close this post?")) return;
        try {
            await closePost(post.id);
            toast.success("Post closed");
            onUpdate?.();
        } catch (err) {
            toast.error("Failed to close post");
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await deletePost(post.id);
            toast.success("Post deleted");
            onUpdate?.();
        } catch (err) {
            toast.error("Failed to delete post");
        }
    };

    const handleOpen = () => {
        onOpen?.();
    };

    const isApplied = currentUserId && post.applicants?.includes(currentUserId);
    const status = applicationStatus || "PENDING"; // Default to pending if applied but status unknown

    // Determine button style based on status
    const getStatusButtonStyle = () => {
        if (status === "ACCEPTED") return { background: "#38AE56", color: "white", borderColor: "#38AE56" };
        if (status === "REJECTED") return { background: "#e74c3c", color: "white", borderColor: "#e74c3c" };
        return { background: "rgba(56, 174, 86, 0.2)", color: "#38AE56", borderColor: "#38AE56" }; // PENDING
    };

    const getStatusText = () => {
        if (status === "ACCEPTED") return "ACCEPTED";
        if (status === "REJECTED") return "REJECTED";
        return "APPLIED";
    };

    return (
        <div style={cardStyle} onClick={handleOpen}>
            <div style={header}>
                <h3 style={title}>{post.title}</h3>
                <span style={{ ...badge, background: getStatusColor(post.status) }}>
                    {post.status}
                </span>
            </div>

            <p style={description}>{post.description.substring(0, 100)}...</p>

            <div style={metaContainer}>
                <div style={metaItem}>
                    <FaTag size={12} color="#888" />
                    <span>{post.category}</span>
                </div>
                {post.duration && (
                    <div style={metaItem}>
                        <FaClock size={12} color="#888" />
                        <span>{post.duration}</span>
                    </div>
                )}
            </div>

            {post.requiredSkills && post.requiredSkills.length > 0 && (
                <div style={{ ...skillsContainerStyle, marginBottom: isOwner ? 16 : 0 }}>
                    {post.requiredSkills.slice(0, 3).map((skill: string, idx: number) => (
                        <span key={idx} style={skillBadge}>{skill}</span>
                    ))}
                    {post.requiredSkills.length > 3 && (
                        <span style={skillBadge}>+{post.requiredSkills.length - 3}</span>
                    )}
                </div>
            )}

            <div style={ownerActions}>
                {isOwner ? (
                    <>
                        <button style={actionBtn} onClick={(e) => { e.stopPropagation(); onViewApplications?.(); }}>
                            <FaListAlt /> Applications
                        </button>
                        {post.status === "OPEN" && (
                            <button style={{ ...actionBtn, color: "#f39c12", borderColor: "#f39c12" }} onClick={handleClose}>
                                <FaBan /> Close
                            </button>
                        )}
                        <button style={{ ...actionBtn, color: "#e74c3c", borderColor: "#e74c3c" }} onClick={handleDelete}>
                            <FaTrash /> Delete
                        </button>
                    </>
                ) : (
                    isApplied ? (
                        <button style={{
                            ...actionBtn,
                            cursor: "default",
                            ...getStatusButtonStyle()
                        }} onClick={(e) => e.stopPropagation()}>
                            {getStatusText()}
                        </button>
                    ) : (
                        <button style={{
                            ...actionBtn,
                            color: post.status === "OPEN" ? "#38AE56" : "#6a6464",
                            borderColor: post.status === "OPEN" ? "#38AE56" : "#6a6464"
                        }} onClick={(e) => { e.stopPropagation(); handleOpen(); }}>
                            {post.status === "OPEN" ? "Open" : "View Details"}
                        </button>
                    )
                )}
            </div>
        </div >
    );
};

/* Styles */
const cardStyle: React.CSSProperties = {
    background: "#2a2323",
    borderRadius: 12,
    padding: 20,
    cursor: "pointer",
    transition: "transform 0.2s, background 0.2s",
    border: "1px solid transparent",
    display: "flex",
    flexDirection: "column"
};

const header: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12
};

const title: React.CSSProperties = {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    margin: 0,
    lineHeight: 1.4
};

const badge: React.CSSProperties = {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
    padding: "4px 8px",
    borderRadius: 8,
    textTransform: "uppercase"
};

const description: React.CSSProperties = {
    fontSize: 14,
    color: "#b0b0b0",
    marginBottom: 16,
    lineHeight: 1.5,
    flex: 1
};

const metaContainer: React.CSSProperties = {
    display: "flex",
    gap: 16,
    marginBottom: 16,
    fontSize: 13,
    color: "#888"
};

const metaItem: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6
};

// Fixed function-based style
const skillsContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 16 // Default margin
};

const skillBadge: React.CSSProperties = {
    fontSize: 11,
    color: "#38AE56",
    background: "rgba(56, 174, 86, 0.1)",
    padding: "4px 8px",
    borderRadius: 6,
    border: "1px solid rgba(56, 174, 86, 0.2)"
};

const ownerActions: React.CSSProperties = {
    display: "flex",
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTop: "1px solid #444"
};

const actionBtn: React.CSSProperties = {
    flex: 1,
    background: "transparent",
    border: "1px solid #888",
    color: "#b0b0b0",
    padding: "6px",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontSize: 12
};

export default PostCard;
