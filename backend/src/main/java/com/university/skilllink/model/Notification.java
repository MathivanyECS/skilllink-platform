package com.university.skilllink.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id private String id;
    private String receiverId; // user id
    private NotificationType type; // NEW_REQUEST, ACCEPTED, REJECTED, WISHLIST_AVAILABLE, COLLAB
    private String content;
    private String link; // frontend route e.g. /sessions/{id}
    private boolean isRead;
    @CreatedDate private LocalDateTime createdAt;

    public enum NotificationType { NEW_REQUEST, ACCEPTED, REJECTED, WISHLIST_AVAILABLE, COLLAB, MESSAGE }
}
