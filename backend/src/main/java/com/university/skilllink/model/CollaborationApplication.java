package com.university.skilllink.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "collaboration_applications")
public class CollaborationApplication {

    @Id
    private String id;

    private String postId;        // CollaborationPost.id
    private String applicantId;   // userId of applicant
    private String message;       // optional applicant message

    private ApplicationStatus status; // PENDING, ACCEPTED, REJECTED

    @CreatedDate
    private LocalDateTime appliedAt;

    private LocalDateTime respondedAt;

    public enum ApplicationStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
