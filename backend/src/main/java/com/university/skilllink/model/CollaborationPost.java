package com.university.skilllink.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "collaboration_posts")
public class CollaborationPost {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;      // PROJECT, COMPETITION, EVENT
    private String createdBy;     // userId of creator
    private String duration;      // e.g., "2 weeks" or ISO date string
    private String status;        // OPEN, CLOSED, FILLED
    private List<String> requiredSkills;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder.Default
    private List<String> applicants = new ArrayList<>();
}
