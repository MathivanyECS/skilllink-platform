package com.university.skilllink.service;

import com.university.skilllink.model.Notification;

import java.util.List;
import java.util.Map;

public interface NotificationService {

    // Methods from HEAD branch
    Notification sendToUser(String userId, String type, String title, String message, Map<String,String> metadata);
    void sendToAllUsers(String type, String title, String message, Map<String,String> metadata);

    // Methods needed for the controller
    List<Notification> getNotificationsForUser(String userId);
    void markAsRead(String notificationId);

    // Optional: other send method from feature branch if you need it
    void send(String receiverId, Notification.NotificationType type, String content, String link);
}
