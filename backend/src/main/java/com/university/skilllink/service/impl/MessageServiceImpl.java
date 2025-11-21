package com.university.skilllink.service.impl;

import com.university.skilllink.model.Message;
import com.university.skilllink.model.SessionBoard;
import com.university.skilllink.repository.MessageRepository;
import com.university.skilllink.repository.SessionBoardRepository;
import com.university.skilllink.service.MessageService;
import com.university.skilllink.dto.Message.MessageDTO;
import com.university.skilllink.dto.Message.SendMessageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    
    private final MessageRepository messageRepository;
    private final SessionBoardRepository sessionBoardRepository;
    
    @Override
    public MessageDTO sendMessage(SendMessageRequest request, String senderId) {
        SessionBoard sessionBoard = sessionBoardRepository.findById(request.getSessionBoardId())
                .orElseThrow(() -> new RuntimeException("Session board not found"));
        
        // TEMPORARY FIX: Use senderId as senderName for now
        String senderName = "User-" + senderId.substring(0, 8);
        
        Message message = new Message();
        message.setSessionBoardId(request.getSessionBoardId());
        message.setSenderId(senderId);
        message.setSenderName(senderName); // ← FIX: Add senderName
        message.setContent(request.getContent());
        message.setMessageType(request.getMessageType());
        message.setIsRead(false); // ← FIX: Set default read status
        message.setTimestamp(LocalDateTime.now());
        message.setCreatedAt(LocalDateTime.now());
        
        Message saved = messageRepository.save(message);
        
        // Update session board's last message time
        sessionBoard.setLastMessageAt(LocalDateTime.now());
        sessionBoardRepository.save(sessionBoard);
        
        return convertToDTO(saved);
    }
    
    @Override
    public List<MessageDTO> getMessagesBySessionBoard(String sessionBoardId) {
        return messageRepository.findBySessionBoardIdOrderByTimestampAsc(sessionBoardId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public void markMessagesAsRead(String sessionBoardId, String userId) {
        List<Message> unreadMessages = messageRepository.findBySessionBoardIdOrderByTimestampAsc(sessionBoardId)
                .stream()
                .filter(message -> !message.getIsRead() && !message.getSenderId().equals(userId))
                .collect(Collectors.toList());
        
        unreadMessages.forEach(message -> message.setIsRead(true));
        messageRepository.saveAll(unreadMessages);
    }
    
    @Override
    public Long getUnreadCount(String sessionBoardId, String userId) {
        return messageRepository.countBySessionBoardIdAndIsReadFalseAndSenderIdNot(sessionBoardId, userId);
    }
    
    private MessageDTO convertToDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSessionBoardId(message.getSessionBoardId());
        dto.setSenderId(message.getSenderId());
        dto.setSenderName(message.getSenderName()); // ← FIX: Add senderName to DTO
        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType());
        dto.setIsRead(message.getIsRead());
        dto.setTimestamp(message.getTimestamp());
        return dto;
    }
}