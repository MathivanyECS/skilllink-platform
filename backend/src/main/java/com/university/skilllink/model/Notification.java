package com.university.skilllink.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
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
}
