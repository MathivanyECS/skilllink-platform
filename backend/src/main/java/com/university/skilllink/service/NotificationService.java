package com.university.skilllink.service;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.NotificationType;

import java.util.List;
import java.util.Map;

public interface NotificationService {
    Notification createNotification(Notification notification); // <-- required

    Notification sendToUser(String userId, NotificationType type, String title, String message, Map<String,String> metadata);
    void sendToAllUsers(NotificationType type, String title, String message, Map<String,String> metadata);
    List<Notification> getNotificationsForUser(String userId);
    List<Notification> getUnreadNotificationsForUser(String userId);
    long getUnreadCount(String userId);
    void markAsRead(String notificationId);
    void markAllAsRead(String userId);
}
