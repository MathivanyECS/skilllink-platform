package com.university.skilllink.dto.collaboration;

import com.university.skilllink.model.CollaborationPost;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CollabPostDTO {
    private String id;
    private String title;
    private String description;
    private String category;
    private String duration; // keeping as String as per your original DTO
    private List<String> requiredSkills;
    private String createdBy;
    private String status;
    private LocalDateTime createdAt;
    private List<String> applicants;

    // Default constructor
    public CollabPostDTO() {}

    // Constructor to map from CollaborationPost entity
    public CollabPostDTO(CollaborationPost post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.description = post.getDescription();
        this.category = post.getCategory();
        this.duration = String.valueOf(post.getDuration()); // convert to String if needed
        this.requiredSkills = post.getRequiredSkills();
        this.createdBy = post.getCreatedBy();
        this.status = post.getStatus();
        this.createdAt = post.getCreatedAt();
        this.applicants = post.getApplicants();
    }
}
