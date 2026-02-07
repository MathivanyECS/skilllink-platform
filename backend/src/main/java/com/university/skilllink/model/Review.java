package com.university.skilllink.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
/**
 * Review Model - Stores session reviews and ratings
 * Contains star ratings and detailed feedback for teachers
 * Links reviews to specific completed learning sessions
 * Supports public/private review visibility
 */

@Document(collection = "reviews")
@Data
public class Review {
    @Id
    private String id;
    private String sessionId; // References learning_sessions._id
    private String reviewerId; // Learner who gives review
    private String reviewedId; // Teacher who receives review
    private Integer rating; // 1-5 stars (Mandatory)
    private String reviewText; // Text feedback (Mandatory)
    
    // Detailed ratings (Optional)
    private Integer helpfulnessRating;
    private Integer communicationRating; 
    private Integer knowledgeRating;
    
    private Boolean isPublic = true; // Whether review is visible on profile
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}