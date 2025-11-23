package com.university.skilllink.service.impl;

import com.university.skilllink.model.Review;
import com.university.skilllink.repository.ReviewRepository;
import com.university.skilllink.service.ReviewService;
import com.university.skilllink.dto.Review.ReviewDTO;
import com.university.skilllink.dto.Review.CreateReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    
    private final ReviewRepository reviewRepository;
    
    @Override
    public ReviewDTO createReview(CreateReviewRequest request, String reviewerId) {
        // Check if review already exists for this session
        if (reviewRepository.findBySessionIdAndReviewerId(request.getSessionId(), reviewerId).isPresent()) {
            throw new RuntimeException("You have already reviewed this session");
        }
        
        Review review = new Review();
        review.setSessionId(request.getSessionId());
        review.setReviewerId(reviewerId);
        review.setReviewedId(request.getReviewedId());
        review.setRating(request.getRating());
        review.setReviewText(request.getReviewText());
        review.setHelpfulnessRating(request.getHelpfulnessRating());
        review.setCommunicationRating(request.getCommunicationRating());
        review.setKnowledgeRating(request.getKnowledgeRating());
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());
        
        Review saved = reviewRepository.save(review);
        return convertToDTO(saved);
    }
    
    @Override
    public List<ReviewDTO> getReviewsByUser(String userId) {
        return reviewRepository.findByReviewedId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ReviewDTO> getReviewsForSession(String sessionId) {
        return reviewRepository.findBySessionIdAndReviewerId(sessionId, null) // This needs custom query
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public ReviewDTO getReviewById(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return convertToDTO(review);
    }
    
    @Override
    public ReviewDTO updateReview(String reviewId, CreateReviewRequest request, String userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getReviewerId().equals(userId)) {
            throw new RuntimeException("You can only update your own reviews");
        }
        
        review.setRating(request.getRating());
        review.setReviewText(request.getReviewText());
        review.setHelpfulnessRating(request.getHelpfulnessRating());
        review.setCommunicationRating(request.getCommunicationRating());
        review.setKnowledgeRating(request.getKnowledgeRating());
        review.setUpdatedAt(LocalDateTime.now());
        
        Review updated = reviewRepository.save(review);
        return convertToDTO(updated);
    }
    
    @Override
    public void deleteReview(String reviewId, String userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getReviewerId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        
        reviewRepository.delete(review);
    }
    
    @Override
    public Double calculateAverageRating(String userId) {
        ReviewRepository.RatingStats stats = reviewRepository.getRatingStatsByReviewedId(userId);
        return stats != null ? stats.getAverage() : 0.0;
    }
    
    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setSessionId(review.getSessionId());
        dto.setReviewerId(review.getReviewerId());
        dto.setReviewedId(review.getReviewedId());
        dto.setRating(review.getRating());
        dto.setReviewText(review.getReviewText());
        dto.setHelpfulnessRating(review.getHelpfulnessRating());
        dto.setCommunicationRating(review.getCommunicationRating());
        dto.setKnowledgeRating(review.getKnowledgeRating());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}