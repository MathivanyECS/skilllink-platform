package com.university.skilllink.controller;

import com.university.skilllink.model.Notification;
import com.university.skilllink.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable String userId) {
        return notificationService.getNotificationsForUser(userId);
    }

    @GetMapping("/{userId}/unread")
    public List<Notification> getUnread(@PathVariable String userId) {
        return notificationService.getUnreadNotificationsForUser(userId);
    }

    @GetMapping("/{userId}/unread/count")
    public long unreadCount(@PathVariable String userId) {
        return notificationService.getUnreadCount(userId);
    }

    @PostMapping("/mark-read/{notificationId}")
    public void markRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
    }

    @PostMapping("/mark-all-read/{userId}")
    public void markAllRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
    }
}
