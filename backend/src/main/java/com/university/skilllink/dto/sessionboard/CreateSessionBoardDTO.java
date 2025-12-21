package com.university.skilllink.dto.sessionboard;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
/**
 * CreateSessionBoardDTO - Request DTO for creating new session boards
 * Contains only the required fields for session creation
 * Includes validation annotations for input safety
 * Used in POST /api/session-boards endpoint
 */

@Data
public class CreateSessionBoardDTO {
    @NotNull(message = "Session ID is required")
    private String sessionId;
    
    @NotNull(message = "Learner ID is required")
    private String learnerId;
    
    @NotNull(message = "Teacher ID is required")
    private String teacherId;
}