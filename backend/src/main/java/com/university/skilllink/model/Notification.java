package com.university.skilllink.model;

import lombok.*;
<<<<<<< HEAD
import org.springframework.data.annotation.CreatedDate;
=======
>>>>>>> feature/collaboration
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
<<<<<<< HEAD
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    // recipient user id
    private String userId;

    // e.g., REQUEST, WISHLIST_CREATED, WISHLIST_AVAILABLE, REQUEST_ACCEPTED, REQUEST_REJECTED
    private String type;

    private String title;
    private String message;

    // optional metadata (providerId, skillName, requestId, etc.)
    private Map<String, String> metadata;

    @Builder.Default
    private Boolean read = false;

    @CreatedDate
    private LocalDateTime createdAt;
=======

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String receiverId; // User who receives this notification
    private NotificationType type; // NEW_REQUEST, ACCEPTED, REJECTED, COLLAB
    private String content;
    private String link; // link to collaboration post or application
    private boolean isRead;
    private LocalDateTime createdAt;

    public enum NotificationType {
        NEW_REQUEST, ACCEPTED, REJECTED, COLLAB
    }

    public void markAsRead() {
        this.isRead = true;
    }
>>>>>>> feature/collaboration
}
