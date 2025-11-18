package com.university.skilllink.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document("skillRequests")
public class SkillRequest {
    @Id private String id;
    private String requesterId;
    private String providerUserId;
    private String profileId;   // optional pointer to profile
    private String skillName;
    private String message;
    private Status status = Status.PENDING;
    private Instant createdAt = Instant.now();

    public enum Status { PENDING, ACCEPTED, REJECTED }
}
