package com.university.skilllink.service;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.NotificationType;

import java.util.List;
import java.util.Map;

/**
 * Unified NotificationService interface.
 * - Strongly-typed methods (NotificationType) used by feature code.
 * - Backwards-compatible string-typed helpers kept for development code.
 */
public interface NotificationService {

    /** Create and persist a full Notification object */
    Notification createNotification(Notification notification);

    /** Strongly-typed send */
    Notification sendToUser(String userId, NotificationType type, String title, String message, Map<String, String> metadata);

    void sendToAllUsers(NotificationType type, String title, String message, Map<String, String> metadata);

    /** Backwards-compatible helpers (string-typed) */
    void sendToUser(String userId, String type, String title, String message, Map<String, String> meta);
    void sendToAllUsers(String type, String title, String message, Map<String, String> meta);

    /** Short helper (content + link) for legacy callers */
    void send(String userId, String content, String link);

    /** Reading */
    List<Notification> getNotificationsForUser(String userId);
    List<Notification> getUserNotifications(String userId); // alias

    List<Notification> getUnreadNotificationsForUser(String userId);
    long getUnreadCount(String userId);

    /** Mark as read */
    void markAsRead(String notificationId);
    void markAsRead(String notificationId, String userId); // extra guard version
    void markAllAsRead(String userId);
}
