package com.university.skilllink.dto.sessionboard;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionBoardDTO {
    private String id;
    private String sessionId;
    private String learnerId;
    private String teacherId;
    private LocalDateTime meetingDateTime;
    private String meetingLocation;
    private String progressNotes;
    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}