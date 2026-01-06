import { Notification } from "./NotificationDrawer";

const typeText: Record<string, string> = {
  NEW_REQUEST: "New skill request received",
  WISHLIST_CREATED: "Wishlist Added",
  REQUEST_ACCEPTED: "Request accepted",
  REQUEST_REJECTED: "Request rejected",
  WISHLIST_AVAILABLE: "Wishlist match found",
  SESSION_UPDATE: "Session update",
  PROFILE_UPDATED: "Profile updated",
  GENERIC: "Notification"
};

const NotificationItem = ({
  data,
  onClick
}: {
  data: Notification;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        cursor: "pointer",
        background: data.read ? "#2a2323" : "#2f4f3a"
      }}
    >
      <strong>{typeText[data.type] || data.title}</strong>

      {!data.read && (
        <span
          style={{
            float: "right",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#38AE56"
          }}
        />
      )}
    </div>
  );
};

export default NotificationItem;
