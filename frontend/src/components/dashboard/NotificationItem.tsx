import { Notification } from "./NotificationDrawer";

const typeText: Record<string, string> = {
  NEW_REQUEST: "New skill request received",
  WISHLIST_CREATED: "Wishlist added",
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
        padding: "16px 18px",
        marginBottom: 14,
        borderRadius: 14,
        cursor: "pointer",

        background: data.read
          ? "linear-gradient(180deg, #2b2525, #221e1e)"
          : "linear-gradient(180deg, #2f2929, #262020)",

        border: "1.5px solid #38AE56",

        boxShadow: data.read
          ? "0 0 0 rgba(0,0,0,0)"
          : "0 0 14px rgba(56,174,86,0.25)",

        transition: "all 0.25s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 22px rgba(56,174,86,0.6)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = data.read
          ? "0 0 0 rgba(0,0,0,0)"
          : "0 0 14px rgba(56,174,86,0.25)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: data.read ? 500 : 700,
            color: "#ffffff",
            letterSpacing: "0.3px"
          }}
        >
          {typeText[data.type] || data.title}
        </span>

        {!data.read && (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#38AE56",
              boxShadow: "0 0 10px rgba(56,174,86,0.9)"
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
