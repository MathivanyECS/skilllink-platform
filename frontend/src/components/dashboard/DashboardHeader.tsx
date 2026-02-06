
import { useState } from "react";
import TopNavigationBar from "../layout/TopNavigationBar";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDrawer from "./NotificationDrawer";

interface DashboardHeaderProps {
    unreadCount: number;
    setUnreadCount: (count: number) => void;
    customStyle?: React.CSSProperties;
}

const DashboardHeader = ({ unreadCount, setUnreadCount, customStyle }: DashboardHeaderProps) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div style={customStyle}>
            <TopNavigationBar
                active="collaboration"
                onNotificationClick={() => setShowNotifications(true)}
                onProfileClick={() => setShowProfileMenu((prev) => !prev)}
            />

            {showProfileMenu && (
                <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
            )}

            <NotificationDrawer
                open={showNotifications}
                onClose={() => setShowNotifications(false)}
                onUnreadCount={setUnreadCount}
            />
        </div>
    );
};

export default DashboardHeader;
