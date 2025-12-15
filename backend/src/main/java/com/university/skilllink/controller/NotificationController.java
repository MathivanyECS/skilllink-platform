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

    /**
     * Preferred: get notifications for the currently authenticated user.
     * (development branch style)
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Legacy / admin-style: get notifications for any user by id.
     * Keeps compatibility with existing callers.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsForUser(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnread(@PathVariable String userId) {
        List<Notification> unread = notificationService.getUnreadNotificationsForUser(userId);
        return ResponseEntity.ok(unread);
    }

    @GetMapping("/{userId}/unread/count")
    public ResponseEntity<Long> unreadCount(@PathVariable String userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    /** Mark a single notification as read for the authenticated user */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String notificationId, Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();
        notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.noContent().build();
    }

    /** Legacy mapping kept for compatibility: mark single notification read without auth (admin use) */
    @PostMapping("/mark-read/{notificationId}")
    public ResponseEntity<Void> markReadLegacy(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.noContent().build();
    }

    /** Mark all notifications as read for the authenticated user */
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    /** Legacy mapping kept for compatibility: mark all by userId path */
    @PostMapping("/mark-all-read/{userId}")
    public ResponseEntity<Void> markAllReadLegacy(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }
}
