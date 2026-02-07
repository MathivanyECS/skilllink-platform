import { useState } from "react";
import { SessionBoard } from "../../types/session.types";
import { updateMeeting } from "../../services/sessionService";
import { X } from "lucide-react";

interface MeetingModalProps {
    session: SessionBoard;
    onClose: () => void;
    onUpdate: () => void;
}

const MeetingModal = ({ session, onClose, onUpdate }: MeetingModalProps) => {
    // Helper to format array to datetime-local string (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dt?: string | number[]) => {
        if (!dt) return "";
        if (Array.isArray(dt)) {
            const [y, m, d, h, min] = dt;
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min)}`;
        }
        return dt;
    };

    const [date, setDate] = useState(formatDateForInput(session.meetingDateTime));
    const [location, setLocation] = useState(session.meetingLocation || "Google Meet");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateMeeting(session.id, date, location);
            onUpdate();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Schedule Meeting</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Location / Link</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                            placeholder="e.g. Google Meet"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-2 rounded-lg transition mt-4"
                    >
                        {loading ? "Saving..." : "Save Meeting"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MeetingModal;
