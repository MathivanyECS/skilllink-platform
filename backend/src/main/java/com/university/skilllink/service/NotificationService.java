package com.university.skilllink.service;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.NotificationType;

import java.util.List;
import java.util.Map;

public interface NotificationService {

    Notification createNotification(Notification notification);

    Notification sendToUser(String userId, NotificationType type, String title, String message, Map<String, String> metadata);

    void sendToAllUsers(NotificationType type, String title, String message, Map<String, String> metadata);

    void sendToUser(String userId, String type, String title, String message, Map<String, String> meta);

    void sendToAllUsers(String type, String title, String message, Map<String, String> meta);

    void send(String userId, String content, String link);

    List<Notification> getNotificationsForUser(String userId);
    List<Notification> getUserNotifications(String userId);

    List<Notification> getUnreadNotificationsForUser(String userId);
    long getUnreadCount(String userId);

    void markAsRead(String notificationId);
    void markAsRead(String notificationId, String userId);
    void markAllAsRead(String userId);

   
    void deleteAllNotificationsForUser(String userId);
}
