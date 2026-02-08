/**
 * Collaboration Page
 * 
 * Main page for the Collaboration module.
 * Shows the collaboration feed - the main view for browsing posts.
 */

import React, { useState } from 'react';
import CollaborationFeed from "../components/collaboration/CollaborationFeed";
import TopNavigationBar from "../components/layout/TopNavigationBar";
import ProfileDropdown from "../components/dashboard/ProfileDropdown";
import NotificationDrawer from "../components/dashboard/NotificationDrawer";

const Collaboration = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <div style={pageStyle}>
      <TopNavigationBar
        active="collaboration"
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={() => setShowProfileMenu(prev => !prev)}
      />

      {showProfileMenu && (
        <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
      )}

      <CollaborationFeed />

      <NotificationDrawer
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        onUnreadCount={setUnreadCount}
      />
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