package com.university.skilllink.dto.sessionboard;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class CreateSessionBoardDTO {
    @NotNull(message = "Session ID is required")
    private String sessionId;
    
    @NotNull(message = "Learner ID is required")
    private String learnerId;
    
    @NotNull(message = "Teacher ID is required")
    private String teacherId;
}