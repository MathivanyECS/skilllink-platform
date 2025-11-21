package com.university.skilllink.service;

import com.university.skilllink.dto.Message.MessageDTO;
import com.university.skilllink.dto.Message.SendMessageRequest;
import java.util.List;

public interface MessageService {
    MessageDTO sendMessage(SendMessageRequest request, String senderId);
    List<MessageDTO> getMessagesBySessionBoard(String sessionBoardId);
    void markMessagesAsRead(String sessionBoardId, String userId);
    Long getUnreadCount(String sessionBoardId, String userId);
}