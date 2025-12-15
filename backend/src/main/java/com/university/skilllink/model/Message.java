package com.university.skilllink.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
/**
 * Message Model - Represents chat messages within session boards
 * Stores communication between learners and teachers
 * Supports different message types (TEXT, MEETING_SCHEDULE, etc.)
 * Tracks read status and timestamps for messaging features
 */

@Document(collection = "messages")
@Data
public class Message {
    @Id
    private String id;
    private String sessionBoardId;
    private String senderId;
    private String senderName;
    private String content;
    private String messageType = "TEXT";
    private Boolean isRead = false;
    private LocalDateTime timestamp;
    private LocalDateTime createdAt;
}