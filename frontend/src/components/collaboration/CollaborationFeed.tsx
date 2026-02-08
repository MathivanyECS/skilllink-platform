import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useCollaborationPosts } from "../../hooks/useCollaboration";
import { CollaborationPost } from "../../types/collaboration.types";
import { useAuth } from "../../hooks/useAuth";
import PostCard from "./PostCard";
import CollaborationPostModal from "./CollaborationPostModal";
import ApplicationsModal from "./ApplicationsModal";
import PostDetailModal from "./PostDetailModal";
import { jwtDecode } from "jwt-decode";

const CollaborationFeed = () => {
    const { posts, loading, error, refetch } = useCollaborationPosts();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("ALL"); // ALL, MY_POSTS
    const [viewApplicationsPostId, setViewApplicationsPostId] = useState<string | null>(null);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const auth = useAuth();
    let currentUserId: string | null = null;

    // Robust User ID extraction
    if (auth && auth.user) {
        currentUserId = (auth.user as any).id || (auth.user as any).userId;
    } else {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                currentUserId = decoded.userId || decoded.sub;
            } catch (e) {
                console.error("Token decode error", e);
            }
        }
    }

    // Debug logging
    useEffect(() => {
        if (posts.length > 0) {
            console.log("DEBUG: Current User ID:", currentUserId);
            console.log("DEBUG: Accessing posts...", posts.length);
            posts.slice(0, 3).forEach(p => {
                console.log(`DEBUG: Post ${p.id} Owner: ${p.userId || p.createdBy}`);
            });
        }
    }, [posts, currentUserId]);

    // Filter posts locally
    const filteredPosts = posts.filter((post: CollaborationPost) => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.requiredSkills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filter === "MY_POSTS") {
            const postOwnerId = post.userId || post.createdBy;
            return matchesSearch && postOwnerId === currentUserId;
        }

        return matchesSearch;
    });

    return (
        <div style={pageStyle}>
            <div style={container}>
                {/* Hero / Header Section */}
                <div style={heroSection}>
                    <h1 style={title}>Find Your Next <span style={{ color: "#38AE56" }}>Project Partner</span></h1>
                    <p style={subtitle}>Collaborate on exciting projects, build your portfolio, and learn from others.</p>

                    <div style={controls}>
                        <div style={searchWrapper}>
                            <FaSearch color="#666" />
                            <input
                                style={searchInput}
                                placeholder="Search projects by title, skills..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div style={filterWrapper}>
                            <button
                                style={filter === "ALL" ? activeFilterBtn : filterBtn}
                                onClick={() => setFilter("ALL")}
                            >
                                Explore
                            </button>
                            <button
                                style={filter === "MY_POSTS" ? activeFilterBtn : filterBtn}
                                onClick={() => setFilter("MY_POSTS")}
                            >
                                My Posts
                            </button>
                        </div>
                    </div>

                    <button style={createButton} onClick={() => setShowCreateModal(true)}>
                        <FaPlus /> Create Post
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div style={loadingStyle}>Loading projects...</div>
                ) : error ? (
                    <div style={errorStyle}>{error}</div>
                ) : filteredPosts.length === 0 ? (
                    <div style={emptyStyle}>
                        <h3>No projects found</h3>
                        <p>Try adjusting your search or create a new post to get started.</p>
                    </div>
                ) : (
                    <div style={grid}>
                        {filteredPosts.map((post: CollaborationPost) => {
                            const postOwnerId = post.userId || post.createdBy;
                            const isOwner = currentUserId ? postOwnerId === currentUserId : false;

                            return (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    isOwner={isOwner}
                                    onViewApplications={() => setViewApplicationsPostId(post.id)}
                                    onUpdate={refetch}
                                    onOpen={() => setSelectedPostId(post.id)}
                                    currentUserId={currentUserId}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            <CollaborationPostModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={refetch}
            />

            <ApplicationsModal
                open={!!viewApplicationsPostId}
                postId={viewApplicationsPostId}
                onClose={() => setViewApplicationsPostId(null)}
                onPostUpdate={refetch}
                onPostDelete={refetch}
            />

            <PostDetailModal
                open={!!selectedPostId}
                postId={selectedPostId}
                onClose={() => setSelectedPostId(null)}
                onPostUpdate={refetch}
            />
        </div>
    );
};

/* Styles */
const pageStyle: React.CSSProperties = {
    minHeight: "100vh", background: "radial-gradient(circle at top, #1e1e1e, #000)", color: "white", paddingBottom: 40
};

const container: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 20px" };

const heroSection: React.CSSProperties = { textAlign: "center", marginBottom: 60, marginTop: 40 };
const title: React.CSSProperties = { fontSize: 42, fontWeight: "bold", marginBottom: 16 };
const subtitle: React.CSSProperties = { fontSize: 18, color: "#b0b0b0", marginBottom: 40 };

const controls: React.CSSProperties = {
    display: "flex", justifyContent: "center", gap: 20, marginBottom: 32, flexWrap: "wrap"
};

const searchWrapper: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 12, background: "#2a2a2a", padding: "12px 20px",
    borderRadius: 30, width: "100%", maxWidth: 400, border: "1px solid #333"
};

const searchInput: React.CSSProperties = {
    background: "transparent", border: "none", color: "white", fontSize: 16, width: "100%", outline: "none"
};

const filterWrapper: React.CSSProperties = {
    display: "flex", background: "#2a2a2a", padding: 4, borderRadius: 30, border: "1px solid #333"
};

const filterBtn: React.CSSProperties = {
    background: "transparent", border: "none", color: "#888", padding: "8px 20px", borderRadius: 20,
    cursor: "pointer", fontWeight: "bold", fontSize: 14, transition: "all 0.2s"
};

const activeFilterBtn: React.CSSProperties = {
    ...filterBtn, background: "#38AE56", color: "white"
};

const createButton: React.CSSProperties = {
    background: "linear-gradient(135deg, #38AE56, #2e8b45)", color: "white", border: "none",
    padding: "16px 32px", borderRadius: 30, fontSize: 16, fontWeight: "bold", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 4px 15px rgba(56, 174, 86, 0.3)",
    transition: "transform 0.2s"
};

const grid: React.CSSProperties = {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24
};

const loadingStyle: React.CSSProperties = { textAlign: "center", padding: 40, color: "#666" };
const errorStyle: React.CSSProperties = { textAlign: "center", padding: 40, color: "#e74c3c" };
const emptyStyle: React.CSSProperties = { textAlign: "center", padding: 60, color: "#666" };

export default CollaborationFeed;