import React from 'react';
import { useAuth } from '../../hooks/useAuth';
// Using a placeholder or common header if available, but for now implementing a basic header
// to satisfy the requirement. 
// Assuming it might use ProfileDropdown or similar if available, but let's keep it simple and safe.

interface DashboardHeaderProps {
    unreadCount?: number;
    setUnreadCount?: (count: number) => void;
    customStyle?: React.CSSProperties;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    unreadCount = 0,
    setUnreadCount,
    customStyle
}) => {
    const { user } = useAuth();

    return (
        <header style={{ ...headerStyle, ...customStyle }}>
            <div style={logoStyle}>SkillLink</div>
            <div style={userSectionStyle}>
                <span>Welcome, {user?.name || 'User'}</span>
                {/* Placeholder for notifications/profile actions */}
                <div style={notificationBadgeStyle}>
                    Notifications: {unreadCount}
                </div>
            </div>
        </header>
    );
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    marginBottom: '20px'
};

const logoStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#38AE56'
};

const userSectionStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
};

const notificationBadgeStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#bbb'
};

export default DashboardHeader;
