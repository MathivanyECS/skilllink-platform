package com.university.skilllink.service;

import com.university.skilllink.model.Notification;

import java.util.List;

public interface NotificationService {
    Notification send(String receiverId, Notification.NotificationType type, String content, String link);
    List<Notification> getNotifications(String receiverId);
    void markAsRead(String notificationId);
    void markAllAsRead(String receiverId);
    long countUnread(String receiverId);
}
