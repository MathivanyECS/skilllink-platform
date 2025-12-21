package com.university.skilllink.service.impl;

import com.university.skilllink.model.Review;
import com.university.skilllink.model.User;
import com.university.skilllink.model.SessionBoard; // Added
import com.university.skilllink.repository.ReviewRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.repository.SessionBoardRepository; // Added
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
    private final UserRepository userRepository;
    private final SessionBoardRepository sessionBoardRepository; // Added for validation
    
    @Override
    public ReviewDTO createReview(CreateReviewRequest request, String reviewerId) {
        // 1. Validate sessionId is REQUIRED (must be linked to a session board)
        if (request.getSessionId() == null || request.getSessionId().isEmpty()) {
            throw new RuntimeException("Session ID is required for reviews");
        }
        
        // 2. Validate session board exists
        SessionBoard sessionBoard = sessionBoardRepository.findById(request.getSessionId())
            .orElseThrow(() -> new RuntimeException("Session board not found with ID: " + request.getSessionId()));
        
        // 3. Validate reviewer exists and is the LEARNER in this session board
        User reviewer = userRepository.findById(reviewerId)
            .orElseThrow(() -> new RuntimeException("Reviewer not found with ID: " + reviewerId));
        
        if (!sessionBoard.getLearnerId().equals(reviewerId)) {
            throw new RuntimeException("Only the learner can review this session");
        }
        
        // 4. Validate reviewed user exists and is the TEACHER in this session board
        User reviewedUser = userRepository.findById(request.getReviewedId())
            .orElseThrow(() -> new RuntimeException("Reviewed user not found with ID: " + request.getReviewedId()));
        
        if (!sessionBoard.getTeacherId().equals(request.getReviewedId())) {
            throw new RuntimeException("Can only review the teacher of this session");
        }
        
        // 5. Check if review already exists for this session board
        if (reviewRepository.findBySessionIdAndReviewerId(request.getSessionId(), reviewerId).isPresent()) {
            throw new RuntimeException("You have already reviewed this session");
        }
        
        // 6. Validate rating is between 1-5
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        
        // 7. Validate sub-ratings if provided
        if (request.getHelpfulnessRating() != null && (request.getHelpfulnessRating() < 1 || request.getHelpfulnessRating() > 5)) {
            throw new RuntimeException("Helpfulness rating must be between 1 and 5");
        }
        if (request.getCommunicationRating() != null && (request.getCommunicationRating() < 1 || request.getCommunicationRating() > 5)) {
            throw new RuntimeException("Communication rating must be between 1 and 5");
        }
        if (request.getKnowledgeRating() != null && (request.getKnowledgeRating() < 1 || request.getKnowledgeRating() > 5)) {
            throw new RuntimeException("Knowledge rating must be between 1 and 5");
        }
        
        // 8. Create and save review
        Review review = new Review();
        review.setSessionId(request.getSessionId()); // This is the sessionBoardId
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
        // Get reviews by sessionId (which is sessionBoardId)
        return reviewRepository.findAll()
                .stream()
                .filter(review -> review.getSessionId() != null && review.getSessionId().equals(sessionId))
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
        
        // Validate rating
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
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
    
    // Get reviews for a specific session board
    public List<ReviewDTO> getReviewsBySessionBoard(String sessionBoardId) {
        return getReviewsForSession(sessionBoardId);
    }
    
    // Check if user can review a session (is learner in that session)
    public boolean canUserReviewSession(String sessionBoardId, String userId) {
        SessionBoard sessionBoard = sessionBoardRepository.findById(sessionBoardId).orElse(null);
        if (sessionBoard == null) return false;
        
        // User is learner AND hasn't reviewed yet
        return sessionBoard.getLearnerId().equals(userId) && 
               !reviewRepository.findBySessionIdAndReviewerId(sessionBoardId, userId).isPresent();
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