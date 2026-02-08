import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { applyToPost } from "../../services/collaborationService";
import toast from "react-hot-toast";

interface ApplyModalProps {
    open: boolean;
    onClose: () => void;
    postId: string;
    postTitle: string;
    onSuccess?: () => void;
}


const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const ApplyModal = ({ open, onClose, postId, postTitle, onSuccess }: ApplyModalProps) => {
    const [message, setMessage] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const msg = message.trim();
        const email = contactInfo.trim();

        // ✅ Validation 1: Empty fields
        if (!msg) {
            toast.error("Please fill in all fields");
            return;
        }

        // ✅ Validation 2: Message length
        if (msg.length < 10) {
            toast.error("Please write at least 10 characters in your message");
            return;
        }


        setLoading(true);
        try {
            await applyToPost(postId, { message: msg, contactInfo: email });
            toast.success("Application submitted successfully!");
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlay}>
            <div style={modal}>
                <div style={header}>
                    <h2 style={title}>Apply for: {postTitle}</h2>
                    <button style={closeButton} onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={field}>
                        <label style={label}>Why are you a good fit?</label>
                        <textarea
                            style={textarea}
                            placeholder="Tell the owner about your skills and experience..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            required
                            minLength={10}
                        />
                    </div>



                    <div style={actions}>
                        <button type="button" style={cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" style={submitButton} disabled={loading}>
                            {loading ? "Sending..." : "Send Application"}
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
    maxWidth: 500,
    borderRadius: 12,
    padding: 24,
    border: "1px solid #333",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
};

const header: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
};

const title: React.CSSProperties = {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    margin: 0
};

const closeButton: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#888",
    cursor: "pointer"
};

const field: React.CSSProperties = { marginBottom: 20 };

const label: React.CSSProperties = {
    display: "block",
    color: "#b0b0b0",
    marginBottom: 8,
    fontSize: 14
};

const input: React.CSSProperties = {
    width: "100%",
    background: "#2a2a2a",
    border: "1px solid #333",
    color: "white",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    outline: "none"
};

const textarea: React.CSSProperties = { ...input, resize: "vertical" };

const actions: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 32
};

const buttonBase: React.CSSProperties = {
    padding: "12px 24px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "bold",
    cursor: "pointer",
    border: "none"
};

const cancelButton: React.CSSProperties = { ...buttonBase, background: "transparent", color: "#b0b0b0" };
const submitButton: React.CSSProperties = { ...buttonBase, background: "#38AE56", color: "white" };

export default ApplyModal;
