import { useEffect, useState } from "react";
import LoadingBlock from "../../components/admin/LoadingBlock";
import EmptyState from "../../components/admin/EmptyState";
import DataTable from "../../components/admin/DataTable";
import StatCard from "../../components/admin/StatCard";
import {
  getCollaborationStats,
  getSkillGapReport,
  getTopSkillProviders,
} from "../../services/adminService";
import {
  CollabStatsDTO,
  SkillGapReportDTO,
  TopSkillProviderDTO,
} from "../../types/admin";

/**
 * ReportsPage
 * Endpoints:
 * - GET /api/admin/reports/top-skill-providers
 * - GET /api/admin/reports/skill-gap
 * - GET /api/admin/reports/collaboration-stats
 */
const ReportsPage = () => {
  const [topProviders, setTopProviders] = useState<TopSkillProviderDTO[] | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapReportDTO[] | null>(null);
  const [stats, setStats] = useState<CollabStatsDTO | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const [tp, sg, cs] = await Promise.all([
        getTopSkillProviders(),
        getSkillGapReport(),
        getCollaborationStats(),
      ]);
      setTopProviders(tp);
      setSkillGap(sg);
      setStats(cs);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load reports");
      setTopProviders([]);
      setSkillGap([]);
      setStats({ totalPosts: 0, totalApplicants: 0, completedCollaborations: 0 });
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!topProviders || !skillGap || !stats) return <LoadingBlock label="Loading reports..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Reports & Analytics</h2>
          <p className="text-sm text-gray-400">
            System-level insights to support data-driven platform improvement.
          </p>
          {error && <p className="mt-2 text-xs text-red-300">* {error}</p>}
        </div>

        <button
          onClick={load}
          className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Collaboration Posts" value={stats.totalPosts} />
        <StatCard title="Total Applicants" value={stats.totalApplicants} />
        <StatCard title="Completed Collaborations" value={stats.completedCollaborations} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-semibold">Top Skill Providers</h3>
        <p className="text-sm text-gray-400 mt-1">
          Users offering high-demand skills.
        </p>

        <div className="mt-4">
          {topProviders.length === 0 ? (
            <EmptyState title="No report data" description="Top skill providers report is empty." />
          ) : (
            <DataTable<TopSkillProviderDTO>
              rows={topProviders}
              rowKey={(r, i) => `${r.userId}-${r.skillName}-${i}`}
              columns={[
                {
                  header: "User",
                  render: (r) => (
                    <div className="space-y-1">
                      <div className="font-semibold">{r.username || "User"}</div>
                      <div className="text-xs text-gray-400">{r.email || r.userId}</div>
                    </div>
                  ),
                },
                { header: "Skill", render: (r) => <span className="text-gray-200">{r.skillName}</span> },
                { header: "Count", className: "text-right", render: (r) => <span className="text-gray-200">{r.count ?? "-"}</span> },
              ]}
            />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-semibold">Skill Gap Report</h3>
        <p className="text-sm text-gray-400 mt-1">
          Compares skill demand vs available providers.
        </p>

        <div className="mt-4">
          {skillGap.length === 0 ? (
            <EmptyState title="No report data" description="Skill gap report is empty." />
          ) : (
            <DataTable<SkillGapReportDTO>
              rows={skillGap}
              rowKey={(r) => r.skillName}
              columns={[
                { header: "Skill", render: (r) => <span className="font-semibold">{r.skillName}</span> },
                { header: "Demand", className: "text-right", render: (r) => <span>{r.demandCount}</span> },
                { header: "Providers", className: "text-right", render: (r) => <span>{r.providerCount}</span> },
                { header: "Gap", className: "text-right", render: (r) => <span>{r.gap}</span> },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;