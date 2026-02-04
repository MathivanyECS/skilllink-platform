/**
 * Collaboration Page
 * 
 * Main page for the Collaboration module.
 * Shows the collaboration feed - the main view for browsing posts.
 */

import CollaborationFeed from "../components/collaboration/CollaborationFeed";

const Collaboration = () => {
  return (
    <div style={pageStyle}>
      <CollaborationFeed />
    </div>
  );
};

/* ================= STYLES ================= */
// Matching the design pattern from UserDashboard

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #1e1e1e, #000)",
  color: "white",
  fontFamily: "Arial, sans-serif"
};

export default Collaboration;
