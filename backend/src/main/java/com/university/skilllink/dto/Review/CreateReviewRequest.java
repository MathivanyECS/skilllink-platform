package com.university.skilllink.dto.Review;

import lombok.Data;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Data
public class CreateReviewRequest {
    @NotNull
    private String sessionId;
    
    @NotNull
    private String reviewedId;
    
    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
    
    private String reviewText;
    
    @Min(1)
    @Max(5)
    private Integer helpfulnessRating;
    
    @Min(1)
    @Max(5)
    private Integer communicationRating;
    
    @Min(1)
    @Max(5)
    private Integer knowledgeRating;
}