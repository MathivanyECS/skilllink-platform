package com.university.skilllink.controller;

import com.university.skilllink.dto.Review.ReviewDTO;
import com.university.skilllink.dto.Review.CreateReviewRequest;
import com.university.skilllink.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReviewController {
    
    private final ReviewService reviewService;
    
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
    
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody CreateReviewRequest request) {
        String reviewerId = getCurrentUserId();
        ReviewDTO review = reviewService.createReview(request, reviewerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(@PathVariable String userId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsForSession(@PathVariable String sessionId) {
        List<ReviewDTO> reviews = reviewService.getReviewsForSession(sessionId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable String reviewId) {
        ReviewDTO review = reviewService.getReviewById(reviewId);
        return ResponseEntity.ok(review);
    }
    
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable String reviewId,
            @Valid @RequestBody CreateReviewRequest request) {
        String userId = getCurrentUserId();
        ReviewDTO review = reviewService.updateReview(reviewId, request, userId);
        return ResponseEntity.ok(review);
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        String userId = getCurrentUserId();
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/user/{userId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable String userId) {
        Double averageRating = reviewService.calculateAverageRating(userId);
        return ResponseEntity.ok(averageRating);
    }
}