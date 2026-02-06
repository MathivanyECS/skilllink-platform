
import { useState, useMemo } from "react";
import { CollaborationPost } from "../../types/collaboration.types";
import PostCard from "./PostCard";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ApplyModal from "./ApplyModal";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

interface ExploreFeedProps {
    posts: CollaborationPost[];
    loading: boolean;
    error: string | null;
    currentUserId: string | null;
    onRefetch: () => void;
}

const ExploreFeed = ({ posts, loading, error, currentUserId, onRefetch }: ExploreFeedProps) => {
    const navigate = useNavigate();
    const auth = useAuth();
    const isAuthenticated = !!auth?.user;

    // Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [skillFilter, setSkillFilter] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "closing">("newest");

    // Apply Modal State
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedPostForApply, setSelectedPostForApply] = useState<CollaborationPost | null>(null);

    // Filter Logic
    const filteredPosts = useMemo(() => {
        if (!posts) return [];

        let result = posts.filter((post) => {
            // 1. Must be OPEN
            if (post.status !== "OPEN") return false;

            // 2. Must NOT be mine (Explore tab is for others' posts)
            if (currentUserId && String(post.createdBy) === currentUserId) return false;

            // 3. Search Term (Title or Description)
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                const matchesTitle = post.title.toLowerCase().includes(lowerTerm);
                const matchesDesc = post.description.toLowerCase().includes(lowerTerm);
                if (!matchesTitle && !matchesDesc) return false;
            }

            // 4. Category Filter
            if (categoryFilter && post.category !== categoryFilter) return false;

            // 5. Skill Filter (Partial match on any skill)
            if (skillFilter) {
                const lowerSkill = skillFilter.toLowerCase();
                const hasSkill = post.requiredSkills?.some(s => s.toLowerCase().includes(lowerSkill));
                if (!hasSkill) return false;
            }

            return true;
        });

        // 6. Sort
        result.sort((a, b) => {
            if (sortOrder === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else {
                // Closing soon (mock logic for now, or just oldest first)
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
        });

        return result;
    }, [posts, currentUserId, searchTerm, categoryFilter, skillFilter, sortOrder]);


    // Handler
    const handleApplyClick = (post: CollaborationPost) => {
        if (!isAuthenticated) {
            toast.error("Please login to apply");
            navigate("/login");
            return;
        }
        setSelectedPostForApply(post);
        setShowApplyModal(true);
    };

    const handleViewDetails = (postId: string) => {
        navigate(`/collaboration/${postId}`);
    };

    return (
        <div>
            {/* INFO LINE */}
            <p style={infoText}>
                Explore open collaborations created by others. You can view details and apply. Only the post owner can manage a post.
            </p>

            {/* FILTER ROW */}
            <div style={filterContainer}>
                {/* Search */}
                <div style={searchBox}>
                    <FaSearch color="#666" />
                    <input
                        style={searchInput}
                        placeholder="Search projects, events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Category */}
                <div style={inputWrapper}>
                    <select
                        style={selectInput}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="PROJECT">Project</option>
                        <option value="COMPETITION">Competition</option>
                        <option value="EVENT">Event</option>
                        <option value="STUDY_GROUP">Study Group</option>
                    </select>
                </div>

                {/* Skill */}
                <div style={inputWrapper}>
                    <input
                        style={textInput}
                        placeholder="Filter by skill..."
                        value={skillFilter}
                        onChange={(e) => setSkillFilter(e.target.value)}
                    />
                </div>

                {/* Sort */}
                <div style={inputWrapper}>
                    <FaFilter color="#666" style={{ marginRight: 8 }} />
                    <select
                        style={selectInput}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="closing">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* RESULTS COUNT */}
            {!loading && (
                <p style={{ color: "#888", marginBottom: 20, fontSize: 14 }}>
                    Showing {filteredPosts.length} opportunities
                </p>
            )}

            {/* POSTS GRID */}
            {loading ? (
                <div style={loadingState}>Loading opportunities...</div>
            ) : error ? (
                <div style={errorState}>{error}</div>
            ) : filteredPosts.length === 0 ? (
                <div style={emptyState}>
                    <p>No open collaborations found matching your criteria.</p>
                </div>
            ) : (
                <div style={postsGrid}>
                    {filteredPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            isOwner={false} // Explore = not mine
                            onApply={handleApplyClick}
                            onView={handleViewDetails}
                        />
                    ))}
                </div>
            )}

            {/* Apply Modal */}
            <ApplyModal
                open={showApplyModal}
                onClose={() => setShowApplyModal(false)}
                postId={selectedPostForApply?.id || ""}
                postTitle={selectedPostForApply?.title || ""}
                onSuccess={() => {
                    onRefetch();
                }}
            />
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

const filterContainer: React.CSSProperties = {
    display: "flex",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap"
};

const searchBox: React.CSSProperties = {
    flex: 2,
    minWidth: 200,
    background: "#2a2323",
    borderRadius: 8,
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10
};

const inputWrapper: React.CSSProperties = {
    flex: 1,
    minWidth: 140,
    background: "#2a2323",
    borderRadius: 8,
    padding: "0 16px",
    display: "flex",
    alignItems: "center"
};

const searchInput: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 14,
    width: "100%",
    outline: "none"
};

const textInput: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 14,
    width: "100%",
    outline: "none",
    padding: "10px 0"
};

const selectInput: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 14,
    width: "100%",
    outline: "none",
    padding: "10px 0",
    cursor: "pointer"
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

export default ExploreFeed;
