import { useEffect, useState } from "react";
import api from "../../services/api";
import NotificationItem from "./NotificationItem";
import NotificationDetailModal from "./NotificationDetailModal";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, string>;
  read: boolean;
  createdAt: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onUnreadCount?: (count: number) => void;
}

const NotificationDrawer = ({ open, onClose, onUnreadCount }: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<Notification | null>(null);

  useEffect(() => {
    if (open) load();

    // 🔥 REAL-TIME WEBSOCKET CONNECTION
    import("sockjs-client").then(({ default: SockJS }) => {
      import("@stomp/stompjs").then(({ Stomp }) => {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
          const userId = localStorage.getItem("userId"); // Ensure userId is stored in localStorage
          if (userId) {
            stompClient.subscribe(`/user/${userId}/queue/notifications`, (message: any) => {
              const newNotif = JSON.parse(message.body);
              setNotifications(prev => [newNotif, ...prev]);
              // Optional: trigger a toast or sound here
            });
          }
        }, (err: any) => console.error("WebSocket Error:", err));

        return () => {
          if (stompClient && stompClient.connected) stompClient.disconnect();
        };
      });
    });

  }, [open]);

  const load = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data);

    const unread = res.data.filter((n: Notification) => !n.read).length;
    onUnreadCount?.(unread);
  };

  const markReadAndRemove = async (id: string) => {
    await api.put(`/notifications/${id}/read`);

    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      onUnreadCount?.(updated.filter(n => !n.read).length);
      return updated;
    });
  };

  if (!open) return null;

  return (
    <>
      <div style={overlay} onClick={onClose} />

      <div style={drawer}>
        <h3>Notifications</h3>

        {notifications.length === 0 && (
          <p style={{ opacity: 0.6 }}>No notifications</p>
        )}

        {notifications.map(n => (
          <NotificationItem
            key={n.id}
            data={n}
            onClick={() => {
              // ✅ OPEN MODAL (DO NOT REMOVE HERE)
              if (
                n.type === "NEW_REQUEST" ||
                n.type === "REQUEST_SENT" || // ✅ IMPORTANT
                n.type === "REQUEST_ACCEPTED" ||
                n.type === "REQUEST_REJECTED" ||
                n.type === "WISHLIST_CREATED" ||
                n.type === "WISHLIST_AVAILABLE"
              ) {
                setSelected(n);
                return;
              }

              markReadAndRemove(n.id);
            }}
          />
        ))}
      </div>

      <NotificationDetailModal
        open={!!selected}
        notification={selected}
        onClose={() => {
          if (selected) {
            markReadAndRemove(selected.id); // ✅ remove only after close
          }
          setSelected(null);
        }}
        onUpdated={() => {
          if (selected) {
            markReadAndRemove(selected.id);
          }
          setSelected(null);
        }}
      />
    </>
  );
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 1000
};

const drawer = {
  position: "fixed" as const,
  right: 0,
  top: 0,
  width: 380,
  height: "100%",
  background: "#1a1414",
  padding: 20,
  overflowY: "auto" as const,
  zIndex: 1001
};



export default NotificationDrawer;
