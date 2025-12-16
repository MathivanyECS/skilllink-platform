package com.university.skilllink.service;

import com.university.skilllink.dto.Review.ReviewDTO;
import com.university.skilllink.dto.Review.CreateReviewRequest;
import java.util.List;

public interface ReviewService {
    ReviewDTO createReview(CreateReviewRequest request, String reviewerId);
    List<ReviewDTO> getReviewsByUser(String userId);
    List<ReviewDTO> getReviewsForSession(String sessionId);
    ReviewDTO getReviewById(String reviewId);
    ReviewDTO updateReview(String reviewId, CreateReviewRequest request, String userId);
    void deleteReview(String reviewId, String userId);
    Double calculateAverageRating(String userId);
}