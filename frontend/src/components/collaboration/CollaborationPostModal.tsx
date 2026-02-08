import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createPost } from "../../services/collaborationService"; // Service check
import toast from "react-hot-toast";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CollaborationPostModal = ({ open, onClose, onSuccess }: Props) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //  Trim for safer validation (ONLY)
        const cleanTitle = title.trim();
        const cleanCategory = category.trim();
        const cleanDescription = description.trim();
        const cleanDuration = duration.trim();
        const cleanSkills = skills.trim();

        //  Required field validation (ONLY)
        if (!cleanTitle || !cleanDescription || !cleanCategory) {
            toast.error("Please fill in all required fields");
            return;
        }

        //  Minimum length validations (ONLY)
        if (cleanTitle.length < 5) {
            toast.error("Title must be at least 5 characters");
            return;
        }
        if (cleanDescription.length < 10) {
            toast.error("Description must be at least 10 characters");
            return;
        }

        //  Optional: Duration basic validation (ONLY)
        // (Allow empty, but if provided must be reasonable length)
        if (cleanDuration && cleanDuration.length < 2) {
            toast.error("Please enter a valid duration (e.g., 2 weeks)");
            return;
        }

        setLoading(true);
        try {
            //  Keep your existing requiredSkills logic (ONLY trimmed safely)
            const requiredSkills = cleanSkills
                .split(",")
                .map(s => s.trim())
                .filter(s => s);

            await createPost({
                title: cleanTitle,
                description: cleanDescription,
                category: cleanCategory,
                duration: cleanDuration,
                requiredSkills
            });

            toast.success("Collaboration post created!");
            onSuccess();
            onClose();

            // Reset form (kept same)
            setTitle("");
            setCategory("");
            setDescription("");
            setDuration("");
            setSkills("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlay}>
            <div style={modal}>
                <div style={header}>
                    <h2 style={modalTitle}>Create Collaboration Post</h2>
                    <button style={closeButton} onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={field}>
                        <label style={label}>Title *</label>
                        <input
                            style={input}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g., Building a React Native App"
                            required
                            minLength={5}
                        />
                    </div>

                    <div style={row}>
                        <div style={{ ...field, flex: 1 }}>
                            <label style={label}>Category *</label>
                            <select
                                style={input}
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Project">1.Project</option>
                                <option value="Competition">2.Competition</option>
                                <option value="Event">3.Event</option>
                            </select>
                        </div>
                        <div style={{ ...field, flex: 1 }}>
                            <label style={label}>Duration</label>
                            <input
                                style={input}
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                placeholder="e.g., 2 weeks"
                            />
                        </div>
                    </div>

                    <div style={field}>
                        <label style={label}>Description *</label>
                        <textarea
                            style={textarea}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Describe your project and what you're looking for..."
                            required
                            minLength={10}
                        />
                    </div>

                    <div style={field}>
                        <label style={label}>Required Skills (comma separated)</label>
                        <input
                            style={input}
                            value={skills}
                            onChange={e => setSkills(e.target.value)}
                            placeholder="e.g., React, Node.js, UI Design"
                        />
                    </div>

                    <div style={actions}>
                        <button type="button" style={cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" style={submitButton} disabled={loading}>
                            {loading ? "Creating..." : "Create Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* Styles */
const overlay: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
};
const modal: React.CSSProperties = {
    background: "#1e1e1e",
    width: "90%",
    maxWidth: 600,
    borderRadius: 12,
    padding: 32,
    border: "1px solid #333",
    maxHeight: "90vh",
    overflowY: "auto"
};
const header: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 };
const modalTitle: React.CSSProperties = { fontSize: 24, fontWeight: "bold", color: "white", margin: 0 };
const closeButton: React.CSSProperties = { background: "transparent", border: "none", color: "#888", cursor: "pointer" };
const field: React.CSSProperties = { marginBottom: 20 };
const row: React.CSSProperties = { display: "flex", gap: 20, marginBottom: 20 };
const label: React.CSSProperties = { display: "block", color: "#b0b0b0", marginBottom: 8, fontSize: 14, fontWeight: 500 };
const input: React.CSSProperties = { width: "100%", background: "#2a2a2a", border: "1px solid #333", color: "white", padding: 12, borderRadius: 8, fontSize: 14, outline: "none" };
const textarea: React.CSSProperties = { ...input, resize: "vertical" };
const actions: React.CSSProperties = { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 32 };
const buttonBase: React.CSSProperties = { padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: "bold", cursor: "pointer", border: "none" };
const cancelButton: React.CSSProperties = { ...buttonBase, background: "transparent", color: "#b0b0b0", border: "1px solid #444" };
const submitButton: React.CSSProperties = { ...buttonBase, background: "#38AE56", color: "white" };

export default CollaborationPostModal;
