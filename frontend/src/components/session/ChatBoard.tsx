import { useState, useEffect, useRef } from "react";
import { SessionBoard, Message } from "../../types/session.types";
import { getMessages, sendMessage, markMessagesAsRead } from "../../services/messageService";
import { Send, MapPin, Calendar, BookOpen } from "lucide-react";
import MeetingModal from "./MeetingModal";
import NotesPanel from "./NotesPanel";

interface ChatBoardProps {
    session: SessionBoard;
    currentUserId: string;
    onSessionUpdate: () => void; // Refresh parent list
}

const ChatBoard = ({ session, currentUserId, onSessionUpdate }: ChatBoardProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Fetch & Poll Messages
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

        fetch();
        const interval = setInterval(fetch, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [session.id]);

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
            // Optimistic update or wait for poll (polling handles it fast enough usually, 
            // but let's re-fetch immediately for better UX)
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

    return (
        <div className="flex-1 flex flex-col h-full bg-black/20 relative">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-2">
                    {session.meetingDateTime && (
                        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-500/30">
                            <Calendar size={14} />
                            <span>{new Date(session.meetingDateTime).toLocaleString()}</span>
                            <MapPin size={14} className="ml-2" />
                            <span>{session.meetingLocation}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
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
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-black/40 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 border border-gray-700"
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
                    <div className="w-80 border-l border-gray-700 bg-black/60 backdrop-blur-md absolute right-0 top-0 bottom-0 z-10">
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
        </div>
    );
};

export default ChatBoard;
