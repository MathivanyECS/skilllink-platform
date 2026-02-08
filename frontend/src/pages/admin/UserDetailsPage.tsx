import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../../components/admin/Badge";
import LoadingBlock from "../../components/admin/LoadingBlock";
import EmptyState from "../../components/admin/EmptyState";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  activateUser,
  clearUserNotifications,
  deactivateUser,
  getUserById,
  getUserDesiredSkills,
  getUserNotifications,
  getUserOfferedSkills,
} from "../../services/adminService";
import { NotificationDTO, OfferedSkillDTO, UserDTO } from "../../types/admin";

/**
 * UserDetailsPage
 * - GET /api/admin/users/{id}
 * - GET offered/desired skills
 * - GET/DELETE notifications
 * - Activate/Deactivate
 */
const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDTO | null>(null);
  const [offered, setOffered] = useState<OfferedSkillDTO[] | null>(null);
  const [desired, setDesired] = useState<string[] | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[] | null>(null);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<{ open: boolean; type?: "activate" | "deactivate" | "clearNoti" }>({ open: false });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!id) return;
    try {
      setError("");
      const [u, o, d, n] = await Promise.all([
        getUserById(id),
        getUserOfferedSkills(id),
        getUserDesiredSkills(id),
        getUserNotifications(id),
      ]);
      setUser(u);
      setOffered(o);
      setDesired(d);
      setNotifications(n);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load user details");
      setUser(null);
      setOffered([]);
      setDesired([]);
      setNotifications([]);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const active = useMemo(() => {
    if (!user) return true;
    return (user.isActive ?? user.active) !== false;
  }, [user]);

  const openConfirm = (type: "activate" | "deactivate" | "clearNoti") => {
    setConfirm({ open: true, type });
  };

  const closeConfirm = () => setConfirm({ open: false });

  const doConfirm = async () => {
    if (!id || !confirm.type) return;
    try {
      setBusy(true);
      if (confirm.type === "activate") await activateUser(id);
      if (confirm.type === "deactivate") await deactivateUser(id);
      if (confirm.type === "clearNoti") await clearUserNotifications(id);
      closeConfirm();
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Action failed");
      closeConfirm();
    } finally {
      setBusy(false);
    }
  };

  if (!offered || !desired || !notifications) return <LoadingBlock label="Loading user details..." />;

  if (!user) {
    return (
      <EmptyState
        title="User not found"
        description="The user id may be invalid or the server rejected the request."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/admin-dashboard/users")}
            className="text-sm text-gray-300 hover:text-white transition"
          >
            ← Back to Users
          </button>

          <h2 className="mt-2 text-xl font-semibold">User Profile</h2>
          <p className="text-sm text-gray-400">Monitor account, skills, and notifications</p>
          {error && <p className="mt-2 text-xs text-red-300">* {error}</p>}
        </div>

        <div className="flex gap-2">
          {active ? (
            <button
              disabled={busy}
              onClick={() => openConfirm("deactivate")}
              className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition text-sm disabled:opacity-50"
            >
              Deactivate
            </button>
          ) : (
            <button
              disabled={busy}
              onClick={() => openConfirm("activate")}
              className="px-4 py-2 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition text-sm disabled:opacity-50"
            >
              Activate
            </button>
          )}

          <button
            onClick={load}
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-gray-400">Identity</div>
          <div className="mt-2 font-semibold">{user.username || user.name || "Unnamed User"}</div>
          <div className="mt-1 text-sm text-gray-300">{user.email}</div>
          <div className="mt-3 flex gap-2">
            <Badge variant={user.role === "ADMIN" ? "warning" : "neutral"}>{user.role}</Badge>
            <Badge variant={active ? "success" : "danger"}>{active ? "Active" : "Deactivated"}</Badge>
          </div>
          <div className="mt-4 text-xs text-gray-400 break-all">
            User ID: {user.id}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-gray-400">Skills Offered</div>
          <div className="mt-3 space-y-2">
            {offered.length === 0 ? (
              <p className="text-sm text-gray-400">No offered skills found.</p>
            ) : (
              offered.slice(0, 6).map((s, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  <div className="text-sm font-semibold">{s.skillName}</div>
                  {s.level && <div className="text-xs text-gray-400">Level: {s.level}</div>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-gray-400">Skills Desired</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {desired.length === 0 ? (
              <p className="text-sm text-gray-400">No desired skills found.</p>
            ) : (
              desired.map((d, idx) => (
                <span key={idx} className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1">
                  {d}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-gray-400">
              Admin can view and clear user notifications if required
            </p>
          </div>

          <button
            disabled={busy || notifications.length === 0}
            onClick={() => openConfirm("clearNoti")}
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition text-sm disabled:opacity-50"
          >
            Clear Notifications
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-400">No notifications found.</p>
          ) : (
            notifications.map((n, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <div className="text-sm text-gray-200">{n.message}</div>
                {n.createdAt && <div className="mt-1 text-xs text-gray-400">{n.createdAt}</div>}
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.type === "deactivate"
            ? "Deactivate this user?"
            : confirm.type === "activate"
            ? "Activate this user?"
            : "Clear all notifications?"
        }
        description={
          confirm.type === "deactivate"
            ? "User access will be disabled until re-activated."
            : confirm.type === "activate"
            ? "User will regain access to the platform."
            : "This will remove all notifications for this user."
        }
        danger={confirm.type === "deactivate" || confirm.type === "clearNoti"}
        confirmText={
          confirm.type === "deactivate"
            ? "Deactivate"
            : confirm.type === "activate"
            ? "Activate"
            : "Clear"
        }
        onCancel={closeConfirm}
        onConfirm={doConfirm}
      />
    </div>
  );
};

export default UserDetailsPage;