package com.university.skilllink.controller;

import com.university.skilllink.model.Notification;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    /**
     * Get notifications for the logged-in user
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();

        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Mark a single notification as read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String notificationId, Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();
        
        notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Mark all notifications as read for the current user
     */
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();
        
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }
}