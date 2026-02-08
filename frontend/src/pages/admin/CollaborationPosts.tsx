import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import LoadingBlock from "../../components/admin/LoadingBlock";
import EmptyState from "../../components/admin/EmptyState";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Badge from "../../components/admin/Badge";
import { deleteCollaborationPost, getAllCollaborationPosts } from "../../services/adminService";
import { CollabPostDTO } from "../../types/admin";

/**
 * CollaborationPostsPage
 * - GET /api/admin/collaboration-posts
 * - DELETE /api/admin/collaboration-posts/{id}
 */
const CollaborationPostsPage = () => {
  const [posts, setPosts] = useState<CollabPostDTO[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<{ open: boolean; post?: CollabPostDTO }>({ open: false });
  const [busyId, setBusyId] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await getAllCollaborationPosts();
      setPosts(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load collaboration posts");
      setPosts([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!posts) return [];
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const id = (p.id || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || id.includes(q);
    });
  }, [posts, search]);

  const statusBadge = (status?: string) => {
    const s = (status || "").toUpperCase();
    if (s === "OPEN") return <Badge variant="success">OPEN</Badge>;
    if (s === "COMPLETED") return <Badge variant="neutral">COMPLETED</Badge>;
    if (s === "CLOSED") return <Badge variant="warning">CLOSED</Badge>;
    return <Badge variant="neutral">{s || "UNKNOWN"}</Badge>;
  };

  const openConfirm = (post: CollabPostDTO) => setConfirm({ open: true, post });
  const closeConfirm = () => setConfirm({ open: false });

  const doDelete = async () => {
    if (!confirm.post) return;
    try {
      setBusyId(confirm.post.id);
      await deleteCollaborationPost(confirm.post.id);
      closeConfirm();
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Delete failed");
      closeConfirm();
    } finally {
      setBusyId("");
    }
  };

  if (!posts) return <LoadingBlock label="Loading collaboration posts..." />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Collaboration Posts Moderation</h2>
          <p className="text-sm text-gray-400">
            View all posts and remove inappropriate or policy-violating content.
          </p>
          {error && <p className="mt-2 text-xs text-red-300">* {error}</p>}
        </div>

        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or id..."
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
        <EmptyState title="No collaboration posts found" description="Try another keyword or refresh." />
      ) : (
        <DataTable<CollabPostDTO>
          rows={filtered}
          rowKey={(r) => r.id}
          columns={[
            {
              header: "Post",
              render: (p) => (
                <div className="space-y-1">
                  <div className="font-semibold">{p.title}</div>
                  {p.description && (
                    <div className="text-xs text-gray-400 line-clamp-2">{p.description}</div>
                  )}
                  <div className="text-xs text-gray-500 break-all">ID: {p.id}</div>
                </div>
              ),
            },
            { header: "Status", render: (p) => statusBadge(p.status) },
            {
              header: "Applicants",
              render: (p) => <span className="text-gray-200">{p.applicantsCount ?? 0}</span>,
              className: "text-center",
            },
            {
              header: "Actions",
              className: "text-right",
              render: (p) => (
                <div className="flex justify-end">
                  <button
                    disabled={busyId === p.id}
                    onClick={() => openConfirm(p)}
                    className="px-3 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-400 transition text-xs disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        title="Delete this collaboration post?"
        description="This action is permanent. The post will be removed from the platform."
        danger
        confirmText="Delete"
        onCancel={closeConfirm}
        onConfirm={doDelete}
      />
    </div>
  );
};

export default CollaborationPostsPage;
