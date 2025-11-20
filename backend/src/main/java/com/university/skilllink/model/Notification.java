package com.university.skilllink.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

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
}
