/**
 * CollaborationFeed Component
 *
 * Main feed wrapper.
 * - Handles Auth check.
 * - Fetches posts (parent state).
 * - Manages Tabs (Explore vs My Posts).
 * - Renders specific feed components.
 */

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FaPlus } from "react-icons/fa";
import { useCollaborationPosts } from "../../hooks/useCollaboration";
import CreatePostModal from "./CreatePostModal";
import DashboardHeader from "../dashboard/DashboardHeader";
import ExploreFeed from "./ExploreFeed";
import MyPostsFeed from "./MyPostsFeed";

const CollaborationFeed = () => {
  const auth = useAuth();
  const user = auth?.user;
  const { posts, loading, error, refetch } = useCollaborationPosts();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"explore" | "my-posts">("explore");

  // Header State
  const [unreadCount, setUnreadCount] = useState(0);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!localStorage.getItem("token");
  const currentUserId = user?.id ? String(user.id) : null;

  const handleCreateSuccess = () => {
    refetch();
    // Optionally switch to my posts or just stay
    setActiveTab("my-posts");
  };

  return (
    <div style={pageContainer}>
      <DashboardHeader
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
        customStyle={{ marginBottom: 0, paddingLeft: 40, paddingRight: 40 }}
      />

      <div style={feedContainer}>
        {/* HERO */}
        <div style={heroSection}>
          <div style={heroContent}>
            <h1 style={heroTitle}>Collaborate. Create. Compete.</h1>
            <p style={heroSubtitle}>
              SkillLink Collaboration connects students for group projects, competitions, and events.
              Explore opportunities, apply with your skills, and build together—securely.
            </p>

            <div style={heroPoints}>
              <span style={pointItem}>🤝 Group project management</span>
              <span style={pointItem}>🚀 Events & competition coordination</span>
              <span style={pointItem}>📩 Applications + real-time notifications</span>
            </div>

            <div style={heroButtons}>
              <button style={exploreButton} onClick={() => {
                const el = document.getElementById("feed-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}>
                Explore Posts
              </button>

              {isAuthenticated ? (
                <button style={createButton} onClick={() => setShowCreateModal(true)}>
                  <FaPlus size={14} />
                  Create Post
                </button>
              ) : (
                <button style={disabledButton}>Login to Create</button>
              )}
            </div>
          </div>
        </div>

        {/* FEED SECTION */}
        <div id="feed-section" style={{ paddingTop: 20 }}>
          {/* TABS */}
          {isAuthenticated ? (
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
          ) : (
            // If not logged in, just show Explore title (simulated tab)
            <div style={tabsContainer}>
              <button style={activeTabStyle}>Explore Public Collaborations</button>
            </div>
          )}

          {/* CONTENT */}
          {activeTab === "explore" ? (
            <ExploreFeed
              posts={posts || []}
              loading={loading}
              error={error}
              currentUserId={currentUserId}
              onRefetch={refetch}
            />
          ) : (
            <MyPostsFeed
              posts={posts || []}
              loading={loading}
              error={error}
              currentUserId={currentUserId}
              onRefetch={refetch}
            />
          )}
        </div>

        {/* Create Post Modal */}
        <CreatePostModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />

      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const pageContainer: React.CSSProperties = {
  minHeight: "100vh",
  paddingBottom: 40
};

const feedContainer: React.CSSProperties = {
  padding: "20px 40px",
  maxWidth: 1200,
  margin: "0 auto"
};

const heroSection: React.CSSProperties = {
  marginBottom: 48,
  padding: "60px 40px",
  background: "linear-gradient(135deg, #1f1a1a 0%, #0d0a0a 100%)",
  borderRadius: 24,
  border: "1px solid #333",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center"
};

const heroContent: React.CSSProperties = {
  maxWidth: 700
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
  fontSize: 18,
  lineHeight: 1.6,
  color: "#d0d0d0",
  marginBottom: 32,
  fontWeight: 400
};

const heroPoints: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  marginBottom: 40,
  flexWrap: "wrap"
};

const pointItem: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.05)",
  color: "#ccc",
  padding: "6px 14px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 500,
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const heroButtons: React.CSSProperties = {
  display: "flex",
  gap: 16,
  justifyContent: "center"
};

const createButton: React.CSSProperties = {
  background: "#38AE56",
  border: "none",
  padding: "14px 28px",
  color: "white",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: "bold",
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  cursor: "pointer",
  transition: "transform 0.2s, background 0.2s"
};

const exploreButton: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #666",
  padding: "14px 28px",
  color: "white",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s"
};

const disabledButton: React.CSSProperties = {
  background: "#333",
  border: "none",
  padding: "14px 28px",
  color: "#888",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "not-allowed"
};

const tabsContainer: React.CSSProperties = {
  display: "flex",
  gap: 32,
  marginBottom: 24,
  borderBottom: "1px solid #333",
  paddingBottom: 0
};

const tabStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  padding: "16px 8px",
  color: "#888",
  fontSize: 18,
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

export default CollaborationFeed;
