/**
 * CreatePostModal Component
 * 
 * Modal for creating a new collaboration post.
 * Requires authentication. Handles form validation and submission.
 * On success, navigates to the newly created post or refreshes the feed.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as collaborationService from "../../services/collaborationService";
import { CollabPostDTO, PostCategory } from "../../types/collaboration.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: (postId: string) => void;
}

const CreatePostModal = ({ open, onClose, onSuccess }: Props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CollabPostDTO>({
    title: "",
    description: "",
    category: PostCategory.PROJECT,
    duration: "",
    requiredSkills: []
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // Handle skill input (add skill on Enter or comma)
  const handleSkillAdd = () => {
    const skill = skillInput.trim();
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skill]
      });
      setSkillInput("");
    }
  };

  // Remove skill from list
  const handleSkillRemove = (skillToRemove: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skillToRemove)
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.duration.trim()) {
      toast.error("Duration is required");
      return;
    }

    try {
      setLoading(true);

      const created = await collaborationService.createPost(formData);

      toast.success("Collaboration post created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: PostCategory.PROJECT,
        duration: "",
        requiredSkills: []
      });
      setSkillInput("");

      onClose();
      onSuccess?.(created.id);
      
      // Navigate to the new post
      navigate(`/collaboration/${created.id}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create post";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>Create Collaboration Post</h2>
        <p style={subtitleStyle}>
          Share a project, competition, or event opportunity
        </p>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <label style={labelStyle}>
            Title <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            style={input}
            placeholder="e.g., React Web App Development Project"
            required
            maxLength={100}
          />

          {/* Category */}
          <label style={labelStyle}>
            Category <span style={{ color: "red" }}>*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            style={select}
            required
          >
            <option value={PostCategory.PROJECT}>Project</option>
            <option value={PostCategory.COMPETITION}>Competition</option>
            <option value={PostCategory.EVENT}>Event</option>
          </select>

          {/* Description */}
          <label style={labelStyle}>
            Description <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            style={textarea}
            placeholder="Describe the collaboration opportunity, goals, and what you're looking for..."
            rows={6}
            required
            maxLength={1000}
          />

          {/* Duration */}
          <label style={labelStyle}>
            Duration <span style={{ color: "red" }}>*</span>
            <span style={{ opacity: 0.6, fontSize: 13, marginLeft: 6 }}>
              e.g., "2 weeks", "1 month", "3 months"
            </span>
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            style={input}
            placeholder="e.g., 2 weeks"
            required
          />

          {/* Required Skills */}
          <label style={labelStyle}>
            Required Skills
            <span style={{ opacity: 0.6, fontSize: 13, marginLeft: 6 }}>
              Press Enter or comma to add
            </span>
          </label>
          <div style={skillInputContainer}>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  handleSkillAdd();
                }
              }}
              style={input}
              placeholder="Type a skill and press Enter"
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              style={addSkillBtn}
            >
              Add
            </button>
          </div>

          {/* Skills list */}
          {formData.requiredSkills.length > 0 && (
            <div style={skillsContainer}>
              {formData.requiredSkills.map((skill, idx) => (
                <span key={idx} style={skillBadge}>
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    style={removeSkillBtn}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={actions}>
            <button
              type="submit"
              style={greenBtn}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
            <button
              type="button"
              style={grayBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
  overflowY: "auto" as const,
  padding: "20px 0"
};

const modal: React.CSSProperties = {
  width: 600,
  maxWidth: "90vw",
  background: "#1f1f1f",
  padding: 32,
  borderRadius: 16,
  color: "white",
  boxShadow: "0 0 40px rgba(0,0,0,0.8)",
  margin: "auto"
};

const titleStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: "bold",
  marginBottom: 8,
  color: "white"
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#b0b0b0",
  marginBottom: 24
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  marginTop: 16,
  fontSize: 14,
  fontWeight: 500,
  color: "white"
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #38AE56",
  background: "#4a4444",
  color: "white",
  fontSize: 14,
  fontFamily: "inherit",
  marginBottom: 4
};

const select: React.CSSProperties = {
  ...input,
  cursor: "pointer"
};

const textarea: React.CSSProperties = {
  ...input,
  resize: "vertical" as const,
  minHeight: 120
};

const skillInputContainer: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 12
};

const addSkillBtn: React.CSSProperties = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "bold",
  whiteSpace: "nowrap" as const
};

const skillsContainer: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 20
};

const skillBadge: React.CSSProperties = {
  background: "#2a2323",
  color: "#38AE56",
  padding: "8px 12px",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  border: "1px solid #38AE56",
  display: "flex",
  alignItems: "center",
  gap: 8
};

const removeSkillBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#38AE56",
  cursor: "pointer",
  fontSize: 18,
  fontWeight: "bold",
  padding: 0,
  width: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 28
};

const greenBtn: React.CSSProperties = {
  background: "#38AE56",
  color: "white",
  border: "none",
  padding: "14px 28px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 15,
  fontWeight: "bold",
  flex: 1
};

const grayBtn: React.CSSProperties = {
  background: "#6a6464",
  color: "white",
  border: "none",
  padding: "14px 28px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 15,
  fontWeight: "bold",
  flex: 1
};

export default CreatePostModal;
