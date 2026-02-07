import { useState, useEffect } from "react";
import { SessionBoard } from "../../types/session.types";
import { getProfileById } from "../../services/profileService";
import { getUnreadCount } from "../../services/messageService";
import { getRequestById, SkillRequest } from "../../services/requestService";

import { deleteSession } from "../../services/sessionService";
import { User, CheckCircle, Trash2, X } from "lucide-react";

interface SessionListProps {
    sessions: SessionBoard[];
    selectedSessionId: string | null;
    currentUserId: string;
    onSelectSession: (id: string) => void;
    onRefresh: () => void;
}

const SessionList = ({ sessions, selectedSessionId, currentUserId, onSelectSession, onRefresh }: SessionListProps) => {
    const [partnerNames, setPartnerNames] = useState<Record<string, string>>({});
    const [skillNames, setSkillNames] = useState<Record<string, string>>({});
    const [sessionStatuses, setSessionStatuses] = useState<Record<string, string>>({});
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    useEffect(() => {
        // OPTIMIZATION: Fetch all details in parallel to reduce loading time
        const fetchDetails = async () => {
            if (sessions.length === 0) return;

            // Create validation maps to avoid duplicate fetches
            const uniquePartnerIds = new Set<string>();
            const uniqueRequestIds = new Set<string>();

            sessions.forEach(s => {
                const pid = s.learnerId === currentUserId ? s.teacherId : s.learnerId;
                if (!partnerNames[pid]) uniquePartnerIds.add(pid);
                if (!skillNames[s.sessionId]) uniqueRequestIds.add(s.sessionId);
            });

            // Parallel Fetching: Partners
            const partnerPromises = Array.from(uniquePartnerIds).map(async (pid) => {
                try {
                    const profile = await getProfileById(pid);
                    return { id: pid, name: profile.fullName };
                } catch {
                    return { id: pid, name: "Unknown User" };
                }
            });

            // Parallel Fetching: Skills & Status
            const requestPromises = Array.from(uniqueRequestIds).map(async (rid) => {
                try {
                    const req = await getRequestById(rid);
                    return { id: rid, skill: req.skillName, status: req.status };
                } catch {
                    return { id: rid, skill: "Session", status: "UNKNOWN" };
                }
            });

            // Wait for all network requests
            const [partners, requests] = await Promise.all([
                Promise.all(partnerPromises),
                Promise.all(requestPromises)
            ]);

            // Batch State Updates
            setPartnerNames(prev => {
                const next = { ...prev };
                partners.forEach(p => next[p.id] = p.name);
                return next;
            });

            setSkillNames(prev => {
                const next = { ...prev };
                requests.forEach(r => next[r.id] = r.skill);
                return next;
            });

            setSessionStatuses(prev => {
                const next = { ...prev };
                requests.forEach(r => next[r.id] = r.status);
                return next;
            });
        };

        fetchDetails();
    }, [sessions, currentUserId]);

    useEffect(() => {
        // 2. Fetch unread counts
        const fetchUnread = async () => {
            const counts: Record<string, number> = {};
            for (const session of sessions) {
                try {
                    const count = await getUnreadCount(session.id);
                    counts[session.id] = count;
                } catch (e) {
                    console.error("Failed to fetch unread count", e);
                }
            }
            setUnreadCounts(counts);
        };

        if (sessions.length > 0) {
            fetchUnread();
            const interval = setInterval(fetchUnread, 3000); // Poll every 3s
            return () => clearInterval(interval);
        }
    }, [sessions]);


    return (
        <div className="w-full md:w-1/3 border-r border-gray-700 bg-black/40 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Sessions</h2>
                <button
                    onClick={() => setIsDeleteMode(!isDeleteMode)}
                    className={`p-2 rounded-full transition ${isDeleteMode ? "bg-red-500/20 text-red-500" : "hover:bg-white/10 text-gray-400"}`}
                    title={isDeleteMode ? "Cancel Delete" : "Delete Sessions"}
                >
                    {isDeleteMode ? <X size={20} /> : <Trash2 size={20} />}
                </button>
            </div>
            {/* Delete Mode Banner */}
            {isDeleteMode && (
                <div className="bg-red-500/10 border-b border-red-500/20 p-2 text-center text-xs text-red-400 font-medium">
                    Select a completed session to delete (or click X to cancel)
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {sessions.length === 0 ? (
                    <div className="p-4 text-gray-400 text-center">No active sessions</div>
                ) : (
                    sessions.map((session) => {
                        const partnerId = session.learnerId === currentUserId ? session.teacherId : session.learnerId;
                        const partnerName = partnerNames[partnerId] || "Loading...";
                        const skillName = skillNames[session.sessionId] || "Loading...";
                        const isCompleted = sessionStatuses[session.sessionId] === "COMPLETED";
                        const unread = unreadCounts[session.id] || 0;
                        const isSelected = selectedSessionId === session.id;

                        const handleDelete = async (e: React.MouseEvent) => {
                            e.stopPropagation(); // Prevent selection

                            // Check logic: Only allow deleting finished/completed sessions
                            if (!isCompleted) {
                                alert("Cannot delete active or unfinished sessions.");
                                return;
                            }

                            if (window.confirm(`Are you sure you want to delete the session for "${skillName}"? This cannot be undone.`)) {
                                try {
                                    await deleteSession(session.id);
                                    onRefresh(); // Refresh parent list
                                    // Optional: If deleted session was selected, clear selection? Parent handles this if list updates.
                                } catch (err) {
                                    console.error("Failed to delete session", err);
                                    alert("Failed to delete session. Please try again.");
                                }
                            }
                        };

                        // In delete mode, clicking the row should trigger delete check
                        const handleClick = (e: React.MouseEvent) => {
                            if (isDeleteMode) {
                                handleDelete(e);
                            } else {
                                onSelectSession(session.id);
                            }
                        };

                        return (
                            <div
                                key={session.id}
                                onClick={handleClick}
                                className={`p-4 cursor-pointer hover:bg-white/5 transition border-b border-gray-800 ${isSelected && !isDeleteMode ? "bg-green-500/10 border-l-4 border-l-green-500" : ""} ${isDeleteMode && !isCompleted ? "opacity-40 cursor-not-allowed" : ""} ${isDeleteMode && isCompleted ? "hover:bg-red-500/10" : ""}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDeleteMode && isCompleted ? "bg-red-500/20 text-red-400" : "bg-gray-700 text-green-400"}`}>
                                            {isDeleteMode ? (isCompleted ? <Trash2 size={18} /> : <User size={20} />) : <User size={20} />}
                                        </div>
                                        <div>
                                            {/* Heading: Course Name */}
                                            <h3 className={`font-bold text-sm ${isSelected ? "text-green-400" : "text-white"}`}>
                                                {skillName}
                                            </h3>

                                            {/* Subtext: Partner Name */}
                                            <p className="text-xs text-gray-300 font-medium">
                                                with {partnerName}
                                            </p>

                                            {/* Status Badge if Completed */}
                                            {isCompleted && (
                                                <div className="flex items-center gap-1 mt-1 text-green-500">
                                                    <CheckCircle size={10} />
                                                    <span className="text-[10px] font-bold uppercase tracking-wide">Completed</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {unread > 0 && (
                                        <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                            {unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SessionList;
