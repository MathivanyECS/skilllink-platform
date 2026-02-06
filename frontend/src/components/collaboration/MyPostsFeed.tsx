
import { useMemo } from "react";
import { CollaborationPost } from "../../types/collaboration.types";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { closePost, deletePost } from "../../services/collaborationService";

interface MyPostsFeedProps {
    posts: CollaborationPost[];
    loading: boolean;
    error: string | null;
    currentUserId: string | null;
    onRefetch: () => void;
}

const MyPostsFeed = ({ posts, loading, error, currentUserId, onRefetch }: MyPostsFeedProps) => {
    const navigate = useNavigate();

    // Filter Logic: show ONLY my posts
    const myPosts = useMemo(() => {
        if (!posts || !currentUserId) return [];

        // Sort logic for my posts (newest first usually best)
        return posts
            .filter(p => String(p.createdBy) === currentUserId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [posts, currentUserId]);


    // Handlers
    const handleViewApps = (postId: string) => {
        navigate(`/collaboration/${postId}`);
    };

    const handleClosePost = async (postId: string) => {
        try {
            await closePost(postId);
            toast.success("Post closed successfully");
            onRefetch();
        } catch (err) {
            toast.error("Failed to close post");
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (window.confirm("Are you sure? This cannot be undone.")) {
            try {
                await deletePost(postId);
                toast.success("Post deleted");
                onRefetch();
            } catch (err) {
                toast.error("Failed to delete post");
            }
        }
    };


    return (
        <div>
            {/* INFO LINE */}
            <p style={infoText}>
                Manage your collaboration posts. Review applications, accept/reject participants, and close the post when filled.
            </p>

            {/* RESULTS COUNT */}
            {!loading && (
                <p style={{ color: "#888", marginBottom: 20, fontSize: 14 }}>
                    You have {myPosts.length} posts
                </p>
            )}

            {/* POSTS GRID */}
            {loading ? (
                <div style={loadingState}>Loading your posts...</div>
            ) : error ? (
                <div style={errorState}>{error}</div>
            ) : myPosts.length === 0 ? (
                <div style={emptyState}>
                    <p>You haven't created any collaboration posts yet.</p>
                </div>
            ) : (
                <div style={postsGrid}>
                    {myPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            isOwner={true}
                            onClose={handleClosePost}
                            onDelete={handleDeletePost}
                            onViewApps={handleViewApps}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/* STYLES */
const infoText: React.CSSProperties = {
    color: "#b0b0b0",
    marginBottom: 24,
    fontSize: 15,
    borderBottom: "1px solid #333",
    paddingBottom: 16
};

const loadingState: React.CSSProperties = {
    textAlign: "center",
    padding: 40,
    color: "#666"
};

const errorState: React.CSSProperties = {
    textAlign: "center",
    padding: 40,
    color: "#e74c3c"
};

const emptyState: React.CSSProperties = {
    textAlign: "center",
    padding: 60,
    background: "#2a2323",
    borderRadius: 12,
    color: "#888"
};

const postsGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24
};

export default MyPostsFeed;
