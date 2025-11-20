package com.university.skilllink.service;

import com.university.skilllink.model.Notification;

import java.util.List;

public interface NotificationService {
    void send(String receiverId, Notification.NotificationType type, String content, String link);
    List<Notification> getNotificationsForUser(String userId);
    void markAsRead(String notificationId);
}
