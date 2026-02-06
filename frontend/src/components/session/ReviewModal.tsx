import { useState } from "react";
import { X, Star, AlertCircle } from "lucide-react";
import { CreateReviewRequest } from "../../types/review.types";
import { createReview } from "../../services/reviewService";
import { updateRequestStatus } from "../../services/requestService";

// Props for the Review Modal
interface ReviewModalProps {
    sessionId: string;
    teacherId: string;
    onClose: () => void;
    onReviewSubmitted: () => void; // Callback to refresh parent UI
}

const ReviewModal = ({ sessionId, teacherId, onClose, onReviewSubmitted }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Optional sub-ratings
    const [helpfulness, setHelpfulness] = useState(0);
    const [communication, setCommunication] = useState(0);
    const [knowledge, setKnowledge] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation: Star rating is mandatory
        if (rating === 0) {
            setError("Please provide a star rating.");
            return;
        }

        // Validation: Review text is mandatory
        if (!reviewText.trim()) {
            setError("Please write a review.");
            return;
        }

        setLoading(true);

        try {
            // Construct Review Data
            const reviewData: CreateReviewRequest = {
                sessionId,
                reviewedId: teacherId,
                rating,
                reviewText,
                // Only include sub-ratings if selected (> 0)
                helpfulnessRating: helpfulness > 0 ? helpfulness : undefined,
                communicationRating: communication > 0 ? communication : undefined,
                knowledgeRating: knowledge > 0 ? knowledge : undefined,
                isPublic: true
            };

            // Call API to create review
            await createReview(reviewData);

            // AUTO-COMPLETE SESSION: Update SkillRequest status to COMPLETED
            await updateRequestStatus(sessionId, "COMPLETED");

            onReviewSubmitted(); // Notify parent (ChatBoard)
            onClose(); // Close modal
        } catch (err: any) {
            console.error("Failed to submit review", err);
            setError(err.response?.data?.message || "Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const StarRating = ({ value, onChange, size = 24, label }: { value: number, onChange: (v: number) => void, size?: number, label?: string }) => {
        const [hover, setHover] = useState(0);
        return (
            <div className="flex flex-col gap-1">
                {label && <label className="text-xs text-gray-400">{label}</label>}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => onChange(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                size={size}
                                className={`${star <= (hover || value)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-600"
                                    } transition-colors`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <h2 className="text-xl font-semibold text-white">Review Session</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Main Rating */}
                    <div className="flex flex-col items-center gap-2">
                        <label className="text-sm text-gray-400">Rate your experience</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110 p-1"
                                >
                                    <Star
                                        size={32}
                                        className={`${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-600"
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-yellow-400 font-medium h-6">
                            {rating > 0 ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1] : ""}
                        </span>
                    </div>

                    {/* Detailed Ratings (Compact) */}
                    <div className="grid grid-cols-3 gap-2 bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex justify-center"><StarRating value={helpfulness} onChange={setHelpfulness} size={16} label="Helpfulness" /></div>
                        <div className="flex justify-center"><StarRating value={communication} onChange={setCommunication} size={16} label="Communication" /></div>
                        <div className="flex justify-center"><StarRating value={knowledge} onChange={setKnowledge} size={16} label="Knowledge" /></div>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Your Feedback</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this mentor..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px] resize-none"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-semibold rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
