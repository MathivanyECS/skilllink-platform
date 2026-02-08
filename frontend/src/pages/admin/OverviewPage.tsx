import { useEffect, useMemo, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import LoadingBlock from "../../components/admin/LoadingBlock";
import EmptyState from "../../components/admin/EmptyState";
import { getActiveUsers, getAllUsers, getAllCollaborationPosts, getCollaborationStats } from "../../services/adminService";
import { CollabPostDTO, CollabStatsDTO, UserDTO } from "../../types/admin";

const OverviewPage = () => {
  const [users, setUsers] = useState<UserDTO[] | null>(null);
  const [activeUsers, setActiveUsers] = useState<any[] | null>(null);
  const [posts, setPosts] = useState<CollabPostDTO[] | null>(null);
  const [stats, setStats] = useState<CollabStatsDTO | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const [u, a, p, s] = await Promise.all([
          getAllUsers(),
          getActiveUsers(),
          getAllCollaborationPosts(),
          getCollaborationStats(),
        ]);
        setUsers(u);
        setActiveUsers(a);
        setPosts(p);
        setStats(s);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load overview data");
        setUsers([]);
        setActiveUsers([]);
        setPosts([]);
        setStats({ totalPosts: 0, totalApplicants: 0, completedCollaborations: 0 });
      }
    })();
  }, []);

  const totals = useMemo(() => {
    const totalUsers = users?.length ?? 0;
    const totalActive = activeUsers?.length ?? 0;
    const totalPosts = stats?.totalPosts ?? posts?.length ?? 0;

    // If your API returns isActive or active boolean, adjust this:
    const deactivatedCount =
      (users || []).filter((u) => (u.isActive === false) || (u.active === false)).length;

    return { totalUsers, totalActive, totalPosts, deactivatedCount };
  }, [users, activeUsers, posts, stats]);

  if (!users || !activeUsers || !posts || !stats) {
    return <LoadingBlock label="Loading admin overview..." />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
        <h2 className="text-xl font-semibold">Admin Module Summary</h2>
        <p className="mt-2 text-sm text-gray-300 leading-relaxed">
          This console provides platform-level monitoring and control. You can manage users,
          moderate collaboration content, and generate analytics to support system integrity, safety, and growth.
        </p>
        {error && <p className="mt-3 text-xs text-red-300">* {error}</p>}
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totals.totalUsers} subtitle="All registered users" />
        <StatCard title="Active Users" value={totals.totalActive} subtitle="Currently active/online (from endpoint)" />
        <StatCard title="Collaboration Posts" value={totals.totalPosts} subtitle="Open + closed posts" />
        <StatCard title="Deactivated Users" value={totals.deactivatedCount} subtitle="Accounts disabled by admin" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Applicants" value={stats.totalApplicants} subtitle="Across all collaboration posts" />
        <StatCard title="Completed Collaborations" value={stats.completedCollaborations} subtitle="Completion indicator" />
        <StatCard title="Moderation Queue" value={(posts || []).filter(p => (p.status || "").toUpperCase() === "OPEN").length} subtitle="Open posts to monitor" />
      </div>

      {users.length === 0 && posts.length === 0 ? (
        <EmptyState
          title="No data available yet"
          description="Once users register and create collaboration posts, analytics will appear here."
        />
      ) : null}
    </div>
  );
};

export default OverviewPage;
