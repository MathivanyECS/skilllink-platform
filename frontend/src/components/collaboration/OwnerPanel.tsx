import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaTrash, FaBan } from "react-icons/fa";
import { CollaborationApplication } from "../../types/collaboration.types"; // Type check
import { respondToApplication, closePost, deletePost } from "../../services/collaborationService";
import { getProfileById } from "../../services/profileService";
import { Profile } from "../../types/profile.types";
import toast from "react-hot-toast";

interface OwnerPanelProps {
    postId: string;
    applications: CollaborationApplication[];
    onApplicationUpdate: () => void;
    onPostUpdate: () => void;
    onPostDelete: () => void;
    postStatus?: string;
}

const OwnerPanel = ({ postId, applications, onApplicationUpdate, onPostUpdate, onPostDelete, postStatus }: OwnerPanelProps) => {
    const [loading, setLoading] = useState(false);
    const [applicantProfiles, setApplicantProfiles] = useState<Record<string, Profile>>({});

    // Fetch profiles for all applicants
    useEffect(() => {
        const fetchProfiles = async () => {
            const profiles: Record<string, Profile> = {};
            // Filter unique applicant IDs that we haven't fetched yet
            const uniqueApplicantIds = Array.from(new Set(applications.map(app => app.applicantId)));

            await Promise.all(uniqueApplicantIds.map(async (userId) => {
                // Check if we already have it in state (optional optimization)
                if (applicantProfiles[userId]) return;

                try {
                    const profileData = await getProfileById(userId);
                    profiles[userId] = profileData;
                } catch (error) {
                    console.error(`Failed to fetch profile for user ${userId}`, error);
                }
            }));

            if (Object.keys(profiles).length > 0) {
                setApplicantProfiles(prev => ({ ...prev, ...profiles }));
            }
        };

        if (applications.length > 0) {
            fetchProfiles();
        }
    }, [applications]); // Re-run if applications list changes

    const handleRespond = async (appId: string, accept: boolean) => {
        try {
            await respondToApplication(postId, appId, accept);
            toast.success(accept ? "Application accepted" : "Application rejected");
            onApplicationUpdate();
        } catch (error) {
            toast.error("Failed to update application");
        }
    };

    const handleClosePost = async () => {
        if (!window.confirm("Are you sure you want to close this post?")) return;
        try {
            await closePost(postId);
            toast.success("Post closed successfully");
            onPostUpdate();
        } catch (error) {
            toast.error("Failed to close post");
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
        try {
            await deletePost(postId);
            onPostDelete();
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    return (
        <div style={panelStyle}>
            <div style={header}>
                <h3 style={title}>Owner Controls</h3>
                <div style={actions}>
                    {postStatus === "OPEN" && (
                        <button style={actionBtn} onClick={handleClosePost}>
                            <FaBan /> Close Post
                        </button>
                    )}
                    <button style={{ ...actionBtn, color: "#e74c3c", borderColor: "#e74c3c" }} onClick={handleDeletePost}>
                        <FaTrash /> Delete Post
                    </button>
                </div>
            </div>

            <h4 style={subTitle}>Applications ({applications.length})</h4>

            {applications.length === 0 ? (
                <p style={emptyText}>No applications yet.</p>
            ) : (
                <div style={list}>
                    {applications.map(app => {
                        const profile = applicantProfiles[app.applicantId];
                        return (
                            <div key={app.id} style={appItem}>
                                <div style={appHeader}>
                                    <div>
                                        <span style={appName}>{profile?.fullName || app.applicantName || "Unknown Applicant"}</span>
                                        <div style={{ fontSize: 13, color: "#a0a0a0" }}>{profile?.email || "No email"}</div>
                                    </div>
                                    <span style={appDate}>
                                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Date unknown"}
                                    </span>
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <span style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Message:</span>
                                    <p style={appMessage}>{app.message || "No message provided"}</p>
                                </div>
                                <div style={appContact}>
                                    <div style={{ marginBottom: 4 }}>
                                        <strong style={{ color: "white" }}>Phone:</strong> {profile?.phoneNumber || "Not provided"}
                                    </div>

                                </div>

                                {app.status === "PENDING" ? (
                                    <div style={appActions}>
                                        <button style={acceptBtn} onClick={() => handleRespond(app.id, true)}>
                                            <FaCheck /> Accept
                                        </button>
                                        <button style={rejectBtn} onClick={() => handleRespond(app.id, false)}>
                                            <FaTimes /> Reject
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ ...statusBadge, background: app.status === "ACCEPTED" ? "#38AE56" : "#e74c3c" }}>
                                        {app.status}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

/* Styles */
const panelStyle: React.CSSProperties = {
    background: "#2a2323", padding: 24, borderRadius: 12, marginTop: 40, border: "1px solid #444"
};

const header: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: "bold", color: "white", margin: 0 };
const subTitle: React.CSSProperties = { fontSize: 16, fontWeight: "bold", color: "#b0b0b0", marginBottom: 16 };
const actions: React.CSSProperties = { display: "flex", gap: 12 };
const actionBtn: React.CSSProperties = {
    background: "transparent", border: "1px solid #888", color: "#b0b0b0", padding: "8px 16px", borderRadius: 6,
    cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 14
};

const emptyText: React.CSSProperties = { color: "#888", fontStyle: "italic" };
const list: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 16 };
const appItem: React.CSSProperties = { background: "rgba(0,0,0,0.2)", padding: 16, borderRadius: 8 };
const appHeader: React.CSSProperties = { display: "flex", justifyContent: "space-between", marginBottom: 8 };
const appName: React.CSSProperties = { fontWeight: "bold", color: "white", display: "block" };
const appDate: React.CSSProperties = { fontSize: 12, color: "#888" };
const appMessage: React.CSSProperties = { color: "#d0d0d0", marginBottom: 8, fontSize: 14 };
const appContact: React.CSSProperties = { color: "#b0b0b0", fontSize: 13, marginBottom: 12 };

const appActions: React.CSSProperties = { display: "flex", gap: 12 };
const appBtn: React.CSSProperties = {
    padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: "bold"
};
const acceptBtn: React.CSSProperties = { ...appBtn, background: "#38AE56", color: "white" };
const rejectBtn: React.CSSProperties = { ...appBtn, background: "#e74c3c", color: "white" };

const statusBadge: React.CSSProperties = {
    display: "inline-block", padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: "bold", color: "white"
};

export default OwnerPanel;