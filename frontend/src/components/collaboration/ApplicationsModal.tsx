
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import OwnerPanel from "./OwnerPanel";
import { usePostApplications } from "../../hooks/useCollaboration";

interface ApplicationsModalProps {
    open: boolean;
    postId: string | null;
    onClose: () => void;
    onPostUpdate: () => void;
    onPostDelete: () => void;
}

const ApplicationsModal = ({ open, postId, onClose, onPostUpdate, onPostDelete }: ApplicationsModalProps) => {
    const { applications, loading, refetch } = usePostApplications(postId);

    useEffect(() => {
        if (open && postId) {
            refetch();
        }
    }, [open, postId, refetch]);

    if (!open || !postId) return null;

    return (
        <div style={overlay}>
            <div style={modal}>
                <button style={closeBtn} onClick={onClose}>
                    <FaTimes />
                </button>

                {loading ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#888" }}>Loading applications...</div>
                ) : (
                    <OwnerPanel
                        postId={postId}
                        applications={applications}
                        onApplicationUpdate={refetch}
                        onPostUpdate={() => {
                            onPostUpdate();
                            onClose();
                        }}
                        onPostDelete={() => {
                            onPostDelete();
                            onClose();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

/* Styles */
const overlay: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000
};

const modal: React.CSSProperties = {
    background: "#1e1e1e", width: "90%", maxWidth: 600, borderRadius: 12,
    position: "relative", maxHeight: "90vh", overflowY: "auto",
    padding: "20px 0" // Padding handled by OwnerPanel mainly
};

const closeBtn: React.CSSProperties = {
    position: "absolute", top: 16, right: 16, background: "transparent", border: "none",
    color: "#888", fontSize: 20, cursor: "pointer", zIndex: 10
};

export default ApplicationsModal;
