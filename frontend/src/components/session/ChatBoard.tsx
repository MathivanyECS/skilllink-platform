import { useState, useEffect, useRef } from "react";
import { SessionBoard, Message } from "../../types/session.types";
import { getMessages, sendMessage, markMessagesAsRead } from "../../services/messageService";
import { Send, MapPin, Calendar, BookOpen, ArrowLeft, Video } from "lucide-react";
import MeetingModal from "./MeetingModal";
import NotesPanel from "./NotesPanel";
import ReviewModal from "./ReviewModal"; // Added
import { CheckCircle, Star } from "lucide-react"; // Added icons
import { getReviewsForSession } from "../../services/reviewService"; // Added service

interface ChatBoardProps {
    session: SessionBoard;
    currentUserId: string;
    onSessionUpdate: () => void; // Refresh parent list
}

// Helper to check if location is a URL
const isUrl = (string: string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

const ChatBoard = ({ session, currentUserId, onSessionUpdate }: ChatBoardProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // Added
    const [hasReviewed, setHasReviewed] = useState(false); // Added
    const scrollRef = useRef<HTMLDivElement>(null);

    const isLearner = session.learnerId === currentUserId; // Identify role

    // 1. Fetch & Poll Messages + Check Review Status
    useEffect(() => {
        const fetch = async () => {
            try {
                const msgs = await getMessages(session.id);
                setMessages(msgs);
                await markMessagesAsRead(session.id); // Mark read on open/update
            } catch (err) {
                console.error(err);
            }
        };

        const checkReview = async () => {
            if (isLearner) {
                try {
                    const reviews = await getReviewsForSession(session.id);
                    // Check if I (current user) have already reviewed this session
                    // This creates the "Reviewed" (Checkmark) status instead of "Review" button
                    const myReview = reviews.find(r => r.reviewerId === currentUserId);
                    if (myReview) {
                        setHasReviewed(true);
                    }
                } catch (err) {
                    console.error("Failed to check review status", err);
                }
            }
        };

        fetch();
        checkReview(); // Initial check

        const interval = setInterval(fetch, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [session.id, isLearner, currentUserId]);

    // 2. Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            await sendMessage({
                sessionBoardId: session.id,
                content: newMessage,
                messageType: "TEXT"
            });
            setNewMessage("");
            onSessionUpdate(); // notify parent
            // Optimistic update or wait for poll
            const msgs = await getMessages(session.id);
            setMessages(msgs);
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Format Date for SL Time
    const formatDateTime = (dateInput?: string | number[]) => {
        if (!dateInput) return "";

        let dateObj: Date;

        // Handle Array format [year, month, day, hour, minute, second...] from Java LocalDateTime
        if (Array.isArray(dateInput)) {
            const [year, month, day, hour, minute, second] = dateInput;
            // Java months are 1-based, JS is 0-based
            dateObj = new Date(year, month - 1, day, hour, minute, second || 0);
        } else {
            // Handle ISO string
            dateObj = new Date(dateInput);
        }

        if (isNaN(dateObj.getTime())) return "Invalid Date";

        return dateObj.toLocaleString("en-US", {
            timeZone: "Asia/Colombo",
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100%-2rem)] m-4 bg-gray-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl relative overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-4">
                    {/* Back Button - Always visible now */}
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                    >
                        <ArrowLeft size={16} color="white" />
                    </button>

                    <div className="flex flex-col gap-1">
                        {session.meetingDateTime && (
                            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-500/30">
                                <Calendar size={14} />
                                <span>{formatDateTime(session.meetingDateTime)}</span>
                            </div>
                        )}
                        {session.meetingLocation && (
                            <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-900/20 px-3 py-1 rounded-full border border-blue-500/30">
                                <MapPin size={14} />
                                {isUrl(session.meetingLocation) ? (
                                    <a
                                        href={session.meetingLocation}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:underline flex items-center gap-1"
                                    >
                                        online meeting
                                        <Video size={10} />
                                    </a>
                                ) : (
                                    <span>{session.meetingLocation}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Review Button (Learner Only) */}
                    {isLearner && (
                        hasReviewed ? (
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-900/30 text-green-400 rounded-lg border border-green-500/30 text-sm font-medium cursor-default">
                                <CheckCircle size={16} />
                                <span>Reviewed</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/20 transition text-sm font-medium"
                            >
                                <Star size={16} />
                                <span>Review Session</span>
                            </button>
                        )
                    )}

                    {/* Online Button Action (Dynamic) */}
                    {session.meetingLocation && isUrl(session.meetingLocation) && (
                        <a
                            href={session.meetingLocation}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition text-sm font-semibold"
                        >
                            <Video size={16} />
                            Join Online
                        </a>
                    )}

                    <button
                        onClick={() => setIsMeetingModalOpen(true)}
                        className="p-2 text-gray-300 hover:text-green-400 transition"
                        title="Schedule Meeting"
                    >
                        <Calendar size={20} />
                    </button>
                    <button
                        onClick={() => setIsNotesOpen(!isNotesOpen)}
                        className={`p-2 transition ${isNotesOpen ? "text-green-400" : "text-gray-300 hover:text-green-400"}`}
                        title="Progress Notes"
                    >
                        <BookOpen size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex relative">
                {/* Messages Area */}
                <div className="flex-1 flex flex-col">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => {
                            const isMe = msg.senderId === currentUserId;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${isMe
                                        ? "bg-green-600 text-white rounded-tr-none"
                                        : "bg-gray-700 text-gray-200 rounded-tl-none"
                                        }`}>
                                        <p>{msg.content}</p>
                                        <span className={`text-[10px] block mt-1 ${isMe ? "text-green-200" : "text-gray-400"}`}>
                                            {formatDateTime(msg.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white/5 border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="flex-1 bg-black/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 border border-white/10 placeholder-gray-500"
                            />
                            <button
                                onClick={handleSend}
                                className="p-2 bg-green-500 rounded-lg text-black hover:bg-green-400 transition"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notes Panel (Side Overlay) */}
                {isNotesOpen && (
                    <div className="w-80 border-l border-white/10 bg-black/60 backdrop-blur-md absolute right-0 top-0 bottom-0 z-10">
                        <NotesPanel session={session} onClose={() => setIsNotesOpen(false)} onUpdate={onSessionUpdate} />
                    </div>
                )}
            </div>

            {isMeetingModalOpen && (
                <MeetingModal
                    session={session}
                    onClose={() => setIsMeetingModalOpen(false)}
                    onUpdate={onSessionUpdate}
                />
            )}

            {/* Review Modal - Opened by "Review Session" button */}
            {isReviewModalOpen && (
                <ReviewModal
                    sessionId={session.id}
                    teacherId={session.teacherId}
                    onClose={() => setIsReviewModalOpen(false)}
                    onReviewSubmitted={() => {
                        setHasReviewed(true); // Update UI locally
                        // Send automatic system message to chat
                        sendMessage({
                            sessionBoardId: session.id,
                            content: "Review Submitted! Thank you for the feedback.",
                            messageType: "SYSTEM"
                        }).catch(console.error);
                        onSessionUpdate(); // Refresh session list
                    }}
                />
            )}
        </div>
    );
};

export default ChatBoard;
