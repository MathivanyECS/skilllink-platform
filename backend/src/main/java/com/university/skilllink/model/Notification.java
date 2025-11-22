package com.university.skilllink.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;

    // The user who will receive the notification
    private String userId;

    // Type of notification (enum defined in NotificationType.java)
    private NotificationType type;

    // Short title for the notification
    private String title;

    // Notification message content
    private String message;

    // Optional metadata (providerId, skillName, requestId, etc.)
    private Map<String, String> metadata;

    // Read/unread status
    @Builder.Default
    private Boolean read = false;

    // Timestamp when notification was created
    private LocalDateTime createdAt;
}
