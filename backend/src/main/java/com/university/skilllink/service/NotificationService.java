package com.university.skilllink.service;

import com.university.skilllink.model.Notification;
import java.util.List;
import java.util.Map;

public interface NotificationService {
    void send(String userId, Notification.NotificationType type, String content, String link);
    List<Notification> getUserNotifications(String userId);
    void markAsRead(String notificationId, String userId);
    void markAllAsRead(String userId);
    void sendToUser(String userId, String type, String title, String message, Map<String, String> meta);
    void sendToAllUsers(String type, String title, String message, Map<String, String> meta);
}