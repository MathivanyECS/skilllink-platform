// SkillRequest.java
package com.university.skilllink.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document("skillRequests")
public class SkillRequest {
    @Id private String id;
    private String requesterId; // seeker
    private String providerId;
    private String skillId;
    private String message;
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED CAN BE SHOWN
    private Instant createdAt;
    // getters/setters
}
