package com.university.skilllink.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "reviews")
@Data
public class Review {
    @Id
    private String id;
    private String sessionId; // References learning_sessions._id
    private String reviewerId; // Learner who gives review
    private String reviewedId; // Teacher who receives review
    private Integer rating; // 1-5 stars
    private String reviewText;
    private Integer helpfulnessRating;
    private Integer communicationRating; 
    private Integer knowledgeRating;
    private Boolean isPublic = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}