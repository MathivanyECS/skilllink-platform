package com.university.skilllink.model;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "skill_requests")
public class SkillRequest {

    @Id
    private String requestId;
    private String requesterId;   // Student userId
    private String providerId;    // Teacher userId
    private String skillName;
    private String note;
    private String status;        // PENDING, ACCEPTED, REJECTED, COMPLETED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
