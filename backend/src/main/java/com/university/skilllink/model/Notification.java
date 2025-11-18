package com.university.skilllink.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document("notifications")
public class Notification {
    @Id private String id;
    private String userId; // recipient
    private String title;
    private String body;
    private boolean read = false;
    private Instant createdAt = Instant.now();
}
