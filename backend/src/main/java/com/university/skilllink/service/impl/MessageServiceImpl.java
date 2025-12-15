package com.university.skilllink.service.impl;

import com.university.skilllink.model.Message;
import com.university.skilllink.model.SessionBoard;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.MessageRepository;
import com.university.skilllink.repository.SessionBoardRepository;
import com.university.skilllink.repository.UserRepository;
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
    private final UserRepository userRepository; 
    
    @Override
    public MessageDTO sendMessage(SendMessageRequest request, String senderId) {
        // 1. Get session board
        SessionBoard sessionBoard = sessionBoardRepository.findById(request.getSessionBoardId())
                .orElseThrow(() -> new RuntimeException("Session board not found"));
        
        // 2. Get user from database to get full name
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + senderId));
        
        // 3. Create and save message with REAL user name
        Message message = new Message();
        message.setSessionBoardId(request.getSessionBoardId());
        message.setSenderId(senderId);
        message.setSenderName(sender.getFullName()); // ← REAL NAME from User
        message.setContent(request.getContent());
        message.setMessageType(request.getMessageType());
        message.setIsRead(false);
        message.setTimestamp(LocalDateTime.now());
        message.setCreatedAt(LocalDateTime.now());
        
        Message saved = messageRepository.save(message);
        
        // 4. Update session board's last message time
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
        dto.setSenderName(message.getSenderName());
        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType());
        dto.setIsRead(message.getIsRead());
        dto.setTimestamp(message.getTimestamp());
        return dto;
    }
}