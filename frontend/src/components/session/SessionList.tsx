import { useState, useEffect } from "react";
import { SessionBoard } from "../../types/session.types";
import { getProfileById } from "../../services/profileService";
import { getUnreadCount } from "../../services/messageService";
import { getRequestById, SkillRequest } from "../../services/requestService";
import { User, CheckCircle } from "lucide-react";

interface SessionListProps {
    sessions: SessionBoard[];
    selectedSessionId: string | null;
    currentUserId: string;
    onSelectSession: (id: string) => void;
}

const SessionList = ({ sessions, selectedSessionId, currentUserId, onSelectSession }: SessionListProps) => {
    const [partnerNames, setPartnerNames] = useState<Record<string, string>>({});
    const [skillNames, setSkillNames] = useState<Record<string, string>>({});
    const [sessionStatuses, setSessionStatuses] = useState<Record<string, string>>({});
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        // 1. Resolve names and skills/status for all sessions
        const fetchDetails = async () => {
            const names: Record<string, string> = {};
            const skills: Record<string, string> = {};
            const statuses: Record<string, string> = {};

            for (const session of sessions) {
                // Determine partner ID
                const partnerId = session.learnerId === currentUserId ? session.teacherId : session.learnerId;

                // Fetch Partner Name
                if (!partnerNames[partnerId]) {
                    try {
                        const profile = await getProfileById(partnerId);
                        names[partnerId] = profile.fullName;
                    } catch (e) {
                        names[partnerId] = "Unknown User";
                    }
                }

                // Fetch Skill Name and Status (using logic that sessionId = requestId)
                if (!skillNames[session.sessionId]) {
                    try {
                        const request = await getRequestById(session.sessionId);
                        skills[session.sessionId] = request.skillName;
                        statuses[session.sessionId] = request.status;
                    } catch (e) {
                        // Fallback if request fetch fails
                        skills[session.sessionId] = "Session";
                    }
                }
            }
            setPartnerNames(prev => ({ ...prev, ...names }));
            setSkillNames(prev => ({ ...prev, ...skills }));
            setSessionStatuses(prev => ({ ...prev, ...statuses }));
        };

        if (sessions.length > 0) {
            fetchDetails();
        }
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
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Sessions</h2>
            </div>

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

                        return (
                            <div
                                key={session.id}
                                onClick={() => onSelectSession(session.id)}
                                className={`p-4 cursor-pointer hover:bg-white/5 transition border-b border-gray-800 ${isSelected ? "bg-green-500/10 border-l-4 border-l-green-500" : ""
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-green-400">
                                            <User size={20} />
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
