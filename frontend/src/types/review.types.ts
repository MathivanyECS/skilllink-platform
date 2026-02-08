// Represents a single review from the backend
export interface Review {
    id: string;
    sessionId: string;
    reviewerId: string;
    reviewedId: string;
    rating: number; // 1-5 stars
    reviewText: string;
    // Optional detailed ratings
    helpfulnessRating?: number;
    communicationRating?: number;
    knowledgeRating?: number;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

// Payload for creating a new review
export interface CreateReviewRequest {
    sessionId: string;
    reviewedId: string;
    rating: number;
    reviewText: string;
    helpfulnessRating?: number;
    communicationRating?: number;
    knowledgeRating?: number;
    isPublic?: boolean;
}

export interface RatingStats {
    averageRating: number;
    totalReviews: number;
}
