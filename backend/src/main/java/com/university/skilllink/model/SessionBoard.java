package com.university.skilllink.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "session_boards")
@Data
public class SessionBoard {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String sessionId; // References learning_sessions._id
    
    private String learnerId; // References users._id
    private String teacherId; // References users._id
    
    private LocalDateTime meetingDateTime;
    private String meetingLocation;
    private String progressNotes;
    
    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}