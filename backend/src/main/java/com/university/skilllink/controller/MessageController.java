package com.university.skilllink.controller;

import com.university.skilllink.dto.Message.MessageDTO;
import com.university.skilllink.dto.Message.SendMessageRequest;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MessageController {
    
    private final MessageService messageService;
    private final UserRepository userRepository; // Added
    
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
    
    private String getCurrentUserId() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getId();
    }
    
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        String senderId = getCurrentUserId(); // Now returns user ID, not email
        MessageDTO message = messageService.sendMessage(request, senderId);
        return ResponseEntity.ok(message);
    }
    
    @GetMapping("/session/{sessionBoardId}")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable String sessionBoardId) {
        List<MessageDTO> messages = messageService.getMessagesBySessionBoard(sessionBoardId);
        return ResponseEntity.ok(messages);
    }
    
    @PutMapping("/session/{sessionBoardId}/read")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable String sessionBoardId) {
        String userId = getCurrentUserId(); // Now returns user ID
        messageService.markMessagesAsRead(sessionBoardId, userId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/session/{sessionBoardId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String sessionBoardId) {
        String userId = getCurrentUserId(); // Now returns user ID
        Long count = messageService.getUnreadCount(sessionBoardId, userId);
        return ResponseEntity.ok(count);
    }
}