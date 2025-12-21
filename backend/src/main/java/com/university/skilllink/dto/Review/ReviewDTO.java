package com.university.skilllink.dto.Review;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private String id;
    private String sessionId;
    private String reviewerId;
    private String reviewedId;
    private Integer rating;
    private String reviewText;
    private Integer helpfulnessRating;
    private Integer communicationRating;
    private Integer knowledgeRating;
    private LocalDateTime createdAt;
}