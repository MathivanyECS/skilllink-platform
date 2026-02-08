import { useEffect, useState } from "react";
import LoadingBlock from "../../components/admin/LoadingBlock";
import StatCard from "../../components/admin/StatCard";
import EmptyState from "../../components/admin/EmptyState";
import { getActiveUsers, getAllUsers } from "../../services/adminService";
import { ActiveUserDTO, UserDTO } from "../../types/admin";

/**
 * SystemHealthPage
 * You listed "System health oversight" as a responsibility.
 * If you don't have backend endpoints yet, this page uses:
 * - GET /api/admin/active-users
 * - GET /api/admin/users
 *
 * Later, you can extend backend for:
 * - uptime
 * - error rate
 * - request latency
 * - DB health
 */
const SystemHealthPage = () => {
  const [users, setUsers] = useState<UserDTO[] | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUserDTO[] | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const [u, a] = await Promise.all([getAllUsers(), getActiveUsers()]);
      setUsers(u);
      setActiveUsers(a);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load system health data");
      setUsers([]);
      setActiveUsers([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!users || !activeUsers) return <LoadingBlock label="Loading system health..." />;

  const deactivatedCount =
    users.filter((u) => (u.isActive === false) || (u.active === false)).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">System Health</h2>
        <p className="text-sm text-gray-400">
          Operational snapshot using currently available admin endpoints.
        </p>
        {error && <p className="mt-2 text-xs text-red-300">* {error}</p>}
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Registered Users" value={users.length} />
        <StatCard title="Active Users" value={activeUsers.length} subtitle="From /api/admin/active-users" />
        <StatCard title="Deactivated Users" value={deactivatedCount} />
        <StatCard title="Health Status" value={error ? "Degraded" : "OK"} subtitle={error ? "Some requests failed" : "All endpoints responding"} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-semibold">Active Users (Snapshot)</h3>
        <p className="text-sm text-gray-400 mt-1">
          This list comes from your active users endpoint.
        </p>

        <div className="mt-4 space-y-2">
          {activeUsers.length === 0 ? (
            <EmptyState title="No active users" description="No activity detected from the active users endpoint." />
          ) : (
            activeUsers.slice(0, 20).map((a, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <div className="text-sm font-semibold">{a.username || a.email || a.userId}</div>
                {a.lastActiveAt && <div className="text-xs text-gray-400 mt-1">Last Active: {a.lastActiveAt}</div>}
                <div className="text-xs text-gray-500 mt-1 break-all">User ID: {a.userId}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={load}
        className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition text-sm"
      >
        Refresh Health
      </button>
    </div>
  );
};

export default SystemHealthPage;