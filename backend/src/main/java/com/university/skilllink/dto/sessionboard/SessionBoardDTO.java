package com.university.skilllink.dto.sessionboard;

import lombok.Data;
import java.time.LocalDateTime;
/**
 * SessionBoardDTO - Data Transfer Object for SessionBoard responses
 * Used to safely transfer session board data to the frontend
 * Excludes sensitive/internal fields, includes only necessary data
 * 
 */

@Data
public class SessionBoardDTO {
    // Contains all display fields for a session board
    // Used in API responses to show session information
    // Maps from SessionBoard model but excludes internal data
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