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
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"})
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    // Get all notifications for the logged-in user
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication auth) {
        String userId = userService.getUserByEmail(auth.getName()).getId();
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    // Mark a notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.noContent().build();
    }
}
