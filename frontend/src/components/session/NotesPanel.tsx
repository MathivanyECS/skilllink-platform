import { useState } from "react";
import { SessionBoard } from "../../types/session.types";
import { updateProgressNotes } from "../../services/sessionService";
import { X, Save } from "lucide-react";

interface NotesPanelProps {
    session: SessionBoard;
    onClose: () => void;
    onUpdate: () => void;
}

const NotesPanel = ({ session, onClose, onUpdate }: NotesPanelProps) => {
    const [notes, setNotes] = useState(session.progressNotes || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProgressNotes(session.id, notes);
            onUpdate();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-white">Progress Notes</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 p-4">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-green-500 resize-none text-sm"
                    placeholder="Track learning progress, shared links, or next steps..."
                />
            </div>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold py-2 rounded-lg transition"
                >
                    <Save size={18} />
                    {loading ? "Saving..." : "Save Notes"}
                </button>
            </div>
        </div>
    );
};

export default NotesPanel;
