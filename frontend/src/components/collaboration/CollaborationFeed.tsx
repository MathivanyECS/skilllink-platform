/**
 * CollaborationFeed Component
 *
 * Main feed view showing all open collaboration posts.
 * - Tabbed view: "Explore" (others' posts) vs "My Posts" (your posts).
 * - "Explore" tab is default.
 * - "Create" button in Hero.
 * - Handles Apply logic via modal.
 * - Handles Close/Delete logic via service calls.
 * - Includes DashboardHeader for Notifications and Profile.
 */

import { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useCollaborationPosts } from "../../hooks/useCollaboration";
import { closePost, deletePost } from "../../services/collaborationService";
import { CollaborationPost } from "../../types/collaboration.types";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";
import ApplyModal from "./ApplyModal";
import DashboardHeader from "../dashboard/DashboardHeader";
import toast from "react-hot-toast";

const CollaborationFeed = () => {
  const auth = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();
  const { posts, loading, error, refetch } = useCollaborationPosts();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"explore" | "my-posts">("explore");

  // Header State
  const [unreadCount, setUnreadCount] = useState(0);

  // Apply Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPostForApply, setSelectedPostForApply] = useState<CollaborationPost | null>(null);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!localStorage.getItem("token");

  // Filter posts based on active tab
  const displayedPosts = useMemo(() => {
    if (!posts) return [];

    // Safety check for user ID type (ensure string comparison)
    const currentUserId = user?.id ? String(user.id) : null;

    if (activeTab === "my-posts") {
      if (!currentUserId) return [];
      // Show ONLY posts created by me
      return posts.filter(post => String(post.createdBy) === currentUserId);
    } else {
      // Explore (all posts except mine)
      if (currentUserId) {
        return posts.filter(post => String(post.createdBy) !== currentUserId);
      }
      return posts; // Guests see all
    }
  }, [posts, activeTab, user]);

  // Handle create post success
  const handleCreateSuccess = (postId: string) => {
    refetch();
    navigate(`/collaboration/${postId}`);
  };

  // Handlers for Card Actions
  const handleApplyClick = (post: CollaborationPost) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedPostForApply(post);
    setShowApplyModal(true);
  };

  const handleClosePost = async (postId: string) => {
    try {
      await closePost(postId);
      toast.success("Post closed successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to close post");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await deletePost(postId);
        toast.success("Post deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleViewDetails = (postId: string) => {
    navigate(`/collaboration/${postId}`);
  };

  return (
    <div style={pageContainer}>
      <DashboardHeader
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
        customStyle={{ marginBottom: 0, paddingLeft: 40, paddingRight: 40 }}
      />

      <div style={feedContainer}>
        {/* Hero / Intro Section */}
        <div style={heroSection}>
          <h1 style={heroTitle}>Collaborate. Create. Compete.</h1>
          <p style={heroSubtitle}>
            Discover group projects, competitions, and events created by peers.
            <br />
            Apply to collaborate, build together, and turn ideas into impact.
          </p>

          <div style={heroPoints}>
            <span style={pointItem}>Work on group projects</span>
            <span style={pointItem}>Join competitions & events</span>
            <span style={pointItem}>Share skills, grow together</span>
          </div>

          {isAuthenticated && (
            <button
              style={createButton}
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus size={18} />
              Create Collaboration
            </button>
          )}
        </div>

        {/* Tabs */}
        {isAuthenticated && (
          <div style={tabsContainer}>
            <button
              style={activeTab === "explore" ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab("explore")}
            >
              Explore
            </button>
            <button
              style={activeTab === "my-posts" ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab("my-posts")}
            >
              My Posts
            </button>
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <div style={resultsInfo}>
            {displayedPosts.length === 0 ? (
              <p>No posts found in {activeTab === "explore" ? "Explore" : "My Posts"}</p>
            ) : (
              <p>
                Showing {displayedPosts.length} opportunities
              </p>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={loadingState}>
            <p>Loading collaboration posts...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={errorState}>
            <p>{error}</p>
            <button style={retryButton} onClick={refetch}>
              Retry
            </button>
          </div>
        )}

        {/* Posts grid */}
        {!loading && !error && (
          <div style={postsGrid}>
            {displayedPosts.length === 0 ? (
              <div style={emptyState}>
                <p style={emptyText}>
                  {activeTab === "explore"
                    ? "No open collaborations available right now."
                    : "You haven't created any collaboration posts yet."}
                </p>
              </div>
            ) : (
              displayedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isOwner={activeTab === "my-posts"}
                  onApply={handleApplyClick}
                  onClose={handleClosePost}
                  onDelete={handleDeletePost}
                  onView={handleViewDetails}
                  onViewApps={handleViewDetails}
                />
              ))
            )}
          </div>
        )}

        {/* Create Post Modal */}
        <CreatePostModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />

        {/* Apply Modal */}
        <ApplyModal
          open={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          postId={selectedPostForApply?.id || ""}
          postTitle={selectedPostForApply?.title || ""}
          onSuccess={() => {
            refetch();
          }}
        />
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const pageContainer: React.CSSProperties = {
  minHeight: "100vh",
  // Ensure background matches theme if needed, usually passed from Layout or global
};

const feedContainer: React.CSSProperties = {
  padding: "20px 40px",
  // Removed minHeight here to let pageContainer handle full view
};

const heroSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 48,
  padding: "60px 20px",
  background: "linear-gradient(135deg, #1f1a1a 0%, #0d0a0a 100%)",
  borderRadius: 24,
  border: "1px solid #333",
  position: "relative",
  overflow: "hidden"
};

const heroTitle: React.CSSProperties = {
  fontSize: 48,
  fontWeight: "800",
  background: "linear-gradient(90deg, #ffffff 0%, #b0b0b0 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
  marginBottom: 20,
  letterSpacing: "-1px"
};

const heroSubtitle: React.CSSProperties = {
  fontSize: 20,
  lineHeight: 1.6,
  color: "#d0d0d0",
  marginBottom: 40,
  maxWidth: 680,
  margin: "0 auto 40px auto",
  fontWeight: 400
};

const heroPoints: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 24,
  marginBottom: 40,
  flexWrap: "wrap"
};

const pointItem: React.CSSProperties = {
  background: "rgba(56, 174, 86, 0.1)",
  color: "#38AE56",
  padding: "8px 16px",
  borderRadius: 20,
  fontSize: 14,
  fontWeight: 600,
  border: "1px solid rgba(56, 174, 86, 0.2)"
};

const createButton: React.CSSProperties = {
  background: "#38AE56",
  border: "none",
  padding: "16px 32px",
  color: "white",
  borderRadius: 12,
  fontSize: 18,
  fontWeight: "bold",
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  cursor: "pointer",
  transition: "transform 0.2s, background 0.2s"
};

const tabsContainer: React.CSSProperties = {
  display: "flex",
  gap: 20,
  marginBottom: 24,
  borderBottom: "1px solid #333",
  paddingBottom: 0
};

const tabStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  padding: "12px 24px",
  color: "#b0b0b0",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  borderBottom: "3px solid transparent",
  transition: "all 0.2s"
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  color: "white",
  borderBottom: "3px solid #38AE56"
};

const resultsInfo: React.CSSProperties = {
  color: "#b0b0b0",
  fontSize: 14,
  marginBottom: 20,
  paddingLeft: 4
};

const loadingState: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  fontSize: 16,
  color: "#b0b0b0"
};

const errorState: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  fontSize: 16,
  color: "#e74c3c"
};

const retryButton: React.CSSProperties = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "bold",
  marginTop: 12
};

const postsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: 24
};

const emptyState: React.CSSProperties = {
  textAlign: "center",
  padding: "80px 20px",
  gridColumn: "1 / -1"
};

const emptyText: React.CSSProperties = {
  fontSize: 16,
  color: "#888",
  marginBottom: 24
};

export default CollaborationFeed;
