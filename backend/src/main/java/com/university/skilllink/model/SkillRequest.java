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
@Document(collection = "skill_requests")
public class SkillRequest {
    @Id
    private String id;
    private String seekerId; // user id who requests
    private String providerId; // user id who will teach
    private String skillName; // skill name or skillId (string)
    private String note;
    private RequestStatus status; // PENDING, ACCEPTED, REJECTED, COMPLETED
    @CreatedDate
    @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    public enum RequestStatus {
        PENDING, ACCEPTED, REJECTED, COMPLETED
    }
}
