
import { useEffect, useState } from "react";
import { FaTimes, FaTag, FaClock, FaCalendar, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useCollaborationPost, usePostApplications } from "../../hooks/useCollaboration";
import ApplyModal from "./ApplyModal";
import OwnerPanel from "./OwnerPanel";
import api from "../../services/api";
import toast from "react-hot-toast";

interface PostDetailModalProps {
    open: boolean;
    postId: string | null;
    onClose: () => void;
    onPostUpdate?: () => void; // Callback to refresh feed
}

const PostDetailModal = ({ open, postId, onClose, onPostUpdate }: PostDetailModalProps) => {
    const auth = useAuth();
    const user = auth?.user;
    const { post, loading, error, refetch } = useCollaborationPost(postId);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    // Only fetch applications if owner
    const { applications, refetch: refetchApplications } = usePostApplications(
        isOwner ? (postId || null) : null
    );

    useEffect(() => {
        if (open && postId) {
            refetch();
            setIsOwner(false); // Reset owner state on open
            setIsApplied(false);
        }
    }, [open, postId, refetch]);

    // Check ownership and application status
    useEffect(() => {
        const checkStatus = async () => {
            if (post) {
                const token = localStorage.getItem("token");
                if (token) {
                    try {
                        let currentUserId = user?.id;
                        if (!currentUserId && (user as any)?.userId) currentUserId = (user as any).userId;

                        // Fallback to API if user object is not fully populated
                        if (!currentUserId) {
                            const response = await api.get("/auth/me");
                            currentUserId = response.data.id;
                        }

                        if (currentUserId) {
                            setIsOwner(post.createdBy === currentUserId || post.userId === currentUserId);
                            setIsApplied(post.applicants?.includes(currentUserId) || false);
                        }
                    } catch (error) {
                        console.error("Error checking status:", error);
                        setIsOwner(false);
                        setIsApplied(false);
                    }
                } else {
                    setIsOwner(false);
                    setIsApplied(false);
                }
            }
        };

        if (open && post) {
            checkStatus();
        }
    }, [post, user, open]);

    // Handle post update (after close/delete)
    const handlePostUpdate = () => {
        refetch();
        refetchApplications();
        onPostUpdate?.(); // Refresh parent feed
    };

    // Handle post delete
    const handlePostDelete = () => {
        toast.success("Post deleted successfully");
        onPostUpdate?.();
        onClose();
    };

    if (!open) return null;

    // Date formatter
    const formatDate = (dateString: string) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case "OPEN": return "#38AE56";
            case "CLOSED": return "#6a6464";
            case "FILLED": return "#4a90e2";
            default: return "#6a6464";
        }
    };

    return (
        <div style={overlay}>
            <div style={modal}>
                <button style={closeBtn} onClick={onClose}>
                    <FaTimes />
                </button>

                {loading ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading post details...</div>
                ) : error || !post ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#e74c3c" }}>{error || "Post not found"}</div>
                ) : (
                    <div style={content}>
                        {/* Header */}
                        <div style={header}>
                            <div style={headerTop}>
                                <h2 style={title}>{post.title}</h2>
                                <span style={{ ...statusBadge, background: getStatusColor(post.status) }}>
                                    {post.status}
                                </span>
                            </div>

                            <div style={metaInfo}>
                                <div style={metaItem}><FaTag /> {post.category}</div>
                                {post.duration && <div style={metaItem}><FaClock /> {post.duration}</div>}
                                <div style={metaItem}><FaCalendar /> Posted {formatDate(post.createdAt)}</div>
                            </div>
                        </div>

                        {/* Body */}
                        <div style={section}>
                            <h3 style={sectionTitle}>Description</h3>
                            <p style={description}>{post.description}</p>
                        </div>

                        {post.requiredSkills?.length > 0 && (
                            <div style={section}>
                                <h3 style={sectionTitle}>Required Skills</h3>
                                <div style={skillsContainer}>
                                    {post.requiredSkills.map((skill, idx) => (
                                        <span key={idx} style={skillBadge}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Apply Button (Non-owner, Open) */}
                        {!isOwner && post.status === "OPEN" && (
                            <div style={section}>
                                <button
                                    style={{
                                        ...applyButton,
                                        background: isApplied ? "#6a6464" : "#38AE56",
                                        cursor: isApplied ? "default" : "pointer"
                                    }}
                                    onClick={() => {
                                        if (isApplied) {
                                            toast.error("You have already applied to this post");
                                        } else {
                                            setShowApplyModal(true);
                                        }
                                    }}
                                    disabled={isApplied}
                                >
                                    {isApplied ? "Applied" : "Apply for Collaboration"}
                                </button>
                            </div>
                        )}

                        {/* Closed/Not Owner Message */}
                        {!isOwner && post.status !== "OPEN" && (
                            <div style={closedMessage}>
                                <p>This collaboration post is {post.status.toLowerCase()}.</p>
                            </div>
                        )}

                        {/* Owner Panel */}
                        {isOwner && (
                            <OwnerPanel
                                postId={post.id}
                                applications={applications}
                                onApplicationUpdate={refetchApplications}
                                onPostUpdate={handlePostUpdate}
                                onPostDelete={handlePostDelete}
                                postStatus={post.status} // Pass status to handle button visibility
                            />
                        )}
                    </div>
                )}

                {/* Apply Modal (Nested) */}
                <ApplyModal
                    open={showApplyModal}
                    onClose={() => setShowApplyModal(false)}
                    postId={postId || ""}
                    postTitle={post?.title || ""}
                    onSuccess={() => {
                        refetch();
                        onPostUpdate?.();
                    }}
                />
            </div>
        </div>
    );
};

/* Styles */
const overlay: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000
};

const modal: React.CSSProperties = {
    background: "#1e1e1e", width: "90%", maxWidth: 800, borderRadius: 12,
    position: "relative", maxHeight: "90vh", overflowY: "auto",
    display: "flex", flexDirection: "column"
};

const closeBtn: React.CSSProperties = {
    position: "absolute", top: 20, right: 20, background: "transparent", border: "none",
    color: "#888", fontSize: 24, cursor: "pointer", zIndex: 10
};

const content: React.CSSProperties = { padding: 32 };

const header: React.CSSProperties = { marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #333" };
const headerTop: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 };
const title: React.CSSProperties = { fontSize: 24, fontWeight: "bold", color: "white", margin: 0, flex: 1, marginRight: 16 };
const statusBadge: React.CSSProperties = { padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: "bold", color: "white" };

const metaInfo: React.CSSProperties = { display: "flex", gap: 16, color: "#b0b0b0", fontSize: 14, flexWrap: "wrap" };
const metaItem: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6 };

const section: React.CSSProperties = { marginBottom: 24 };
const sectionTitle: React.CSSProperties = { fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 12 };
const description: React.CSSProperties = { fontSize: 16, lineHeight: 1.6, color: "#d0d0d0" };

const skillsContainer: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8 };
const skillBadge: React.CSSProperties = { background: "#2a2323", color: "#38AE56", padding: "8px 14px", borderRadius: 8, fontSize: 13, border: "1px solid #38AE56" };

const applyButton: React.CSSProperties = { background: "#38AE56", color: "white", border: "none", padding: "14px", borderRadius: 8, fontSize: 16, fontWeight: "bold", width: "100%", cursor: "pointer" };
const closedMessage: React.CSSProperties = { textAlign: "center", padding: 20, background: "#2a2323", borderRadius: 8, color: "#888" };

export default PostDetailModal;
