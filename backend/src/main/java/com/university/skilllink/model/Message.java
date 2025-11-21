package com.university.skilllink.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

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