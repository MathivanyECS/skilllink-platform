package com.university.skilllink.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

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

    // Type of notification (for categorizing or filtering)
    private NotificationType type;

    // Notification message content
    private String content;

    // Link to navigate when notification is clicked
    private String link;

    // Read/unread status
    private boolean read;

    // Timestamp when notification was created
    private LocalDateTime createdAt;

    // Enum for notification types
    public enum NotificationType {
        COLLAB,        // New collaboration post created
        NEW_REQUEST,   // Someone applied to your post
        ACCEPTED,      // Your application was accepted
        REJECTED       // Your application was rejected
    }
}