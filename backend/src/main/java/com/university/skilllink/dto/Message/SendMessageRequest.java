package com.university.skilllink.dto.Message;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class SendMessageRequest {
    @NotNull
    private String sessionBoardId;  // Required - which session to send to
    
    @NotNull  
    private String content;         // Required - message text
    
    private String messageType = "TEXT"; // Optional - defaults to TEXT
}