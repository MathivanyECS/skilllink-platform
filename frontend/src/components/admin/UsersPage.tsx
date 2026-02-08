import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/admin/DataTable";
import LoadingBlock from "../../components/admin/LoadingBlock";
import EmptyState from "../../components/admin/EmptyState";
import Badge from "../../components/admin/Badge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { activateUser, deactivateUser, getAllUsers } from "../../services/adminService";
import { UserDTO } from "../../types/admin";

/**
 * UsersPage
 * - View all users
 * - Quick actions: activate/deactivate
 * - Navigate to details page
 */
const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDTO[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<{ open: boolean; user?: UserDTO; action?: "activate" | "deactivate" }>({
    open: false,
  });
  const [busyId, setBusyId] = useState<string>("");

  const load = async () => {
    try {
      setError("");
      const data = await getAllUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load users");
      setUsers([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const uname = (u.username || u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const id = (u.id || "").toLowerCase();
      return uname.includes(q) || email.includes(q) || id.includes(q);
    });
  }, [users, search]);

  const statusBadge = (u: UserDTO) => {
    const active = u.isActive ?? u.active;
    if (active === false) return <Badge variant="danger">Deactivated</Badge>;
    return <Badge variant="success">Active</Badge>;
  };

  const roleBadge = (u: UserDTO) => {
    if (u.role === "ADMIN") return <Badge variant="warning">ADMIN</Badge>;
    return <Badge variant="neutral">USER</Badge>;
  };

  const openConfirm = (user: UserDTO, action: "activate" | "deactivate") => {
    setConfirm({ open: true, user, action });
  };

  const closeConfirm = () => setConfirm({ open: false });

  const doAction = async () => {
    if (!confirm.user || !confirm.action) return;
    try {
      setBusyId(confirm.user.id);
      if (confirm.action === "activate") await activateUser(confirm.user.id);
      if (confirm.action === "deactivate") await deactivateUser(confirm.user.id);
      closeConfirm();
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Action failed");
      closeConfirm();
    } finally {
      setBusyId("");
    }
  };

  if (!users) return <LoadingBlock label="Loading users..." />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-sm text-gray-400">
            View all users, open profiles, and activate/deactivate accounts.
          </p>
          {error && <p className="mt-2 text-xs text-red-300">* {error}</p>}
        </div>

        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username, email, or id..."
            className="w-full md:w-[360px] px-4 py-2 rounded-xl bg-black/50 border border-white/10 focus:outline-none focus:border-green-400"
          />

          <button
            onClick={load}
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users found" description="Try changing the search keyword." />
      ) : (
        <DataTable<UserDTO>
          rows={filtered}
          rowKey={(r) => r.id}
          columns={[
            {
              header: "User",
              render: (u) => (
                <div className="space-y-1">
                  <div className="font-semibold">{u.username || u.name || "Unnamed User"}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </div>
              ),
            },
            { header: "Role", render: (u) => roleBadge(u) },
            { header: "Status", render: (u) => statusBadge(u) },
            {
              header: "Actions",
              className: "text-right",
              render: (u) => {
                const active = u.isActive ?? u.active;
                return (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/admin-dashboard/users/${u.id}`)}
                      className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-xs"
                    >
                      View
                    </button>

                    {active === false ? (
                      <button
                        disabled={busyId === u.id}
                        onClick={() => openConfirm(u, "activate")}
                        className="px-3 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition text-xs disabled:opacity-50"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        disabled={busyId === u.id}
                        onClick={() => openConfirm(u, "deactivate")}
                        className="px-3 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-400 transition text-xs disabled:opacity-50"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                );
              },
            },
          ]}
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.action === "deactivate"
            ? "Deactivate this user?"
            : "Activate this user?"
        }
        description={
          confirm.action === "deactivate"
            ? "The user will be blocked from using the platform until re-activated."
            : "The user will regain platform access."
        }
        danger={confirm.action === "deactivate"}
        confirmText={confirm.action === "deactivate" ? "Deactivate" : "Activate"}
        onCancel={closeConfirm}
        onConfirm={doAction}
      />
    </div>
  );
};

export default UsersPage;