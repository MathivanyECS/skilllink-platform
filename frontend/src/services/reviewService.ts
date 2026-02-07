import api from "./api";
import { Review, CreateReviewRequest } from "../types/review.types";

// Submit a new review
export const createReview = async (reviewData: CreateReviewRequest): Promise<Review> => {
    const response = await api.post<Review>("/reviews", reviewData);
    return response.data;
};

// Get all reviews for a specific session (used to check if reviewed)
export const getReviewsForSession = async (sessionId: string): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/reviews/session/${sessionId}`);
    return response.data;
};

// Get reviews for a specific user (displayed on their profile)
export const getReviewsByUser = async (userId: string): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/reviews/user/${userId}`);
    return response.data;
};

// Get average rating (e.g., 4.5) for a user
export const getAverageRating = async (userId: string): Promise<number> => {
    const response = await api.get<number>(`/reviews/user/${userId}/average-rating`);
    return response.data;
};
