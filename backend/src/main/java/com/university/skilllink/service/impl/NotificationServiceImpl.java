package com.university.skilllink.service.impl;

import com.university.skilllink.exception.ForbiddenException;
import com.university.skilllink.exception.ResourceNotFoundException;
import com.university.skilllink.model.Notification;
import com.university.skilllink.model.NotificationType;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.NotificationRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ------------------- Creation / Sending -------------------
    @Override
    public Notification createNotification(Notification notification) {
        if (notification == null) return null;
        if (notification.getCreatedAt() == null) notification.setCreatedAt(LocalDateTime.now());
        if (notification.getRead() == null) notification.setRead(false);
        if (notification.getMetadata() == null) notification.setMetadata(Map.of());
        return notificationRepository.save(notification);
    }

    @Override
    public Notification sendToUser(String userId, NotificationType type, String title, String message, Map<String, String> metadata) {
        if (userId == null) return null;
        Notification n = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .metadata(metadata == null ? Map.of() : metadata)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();
        return notificationRepository.save(n);
    }

    @Override
    public void sendToAllUsers(NotificationType type, String title, String message, Map<String, String> metadata) {
        List<User> users = userRepository.findAll();
        List<Notification> batch = new ArrayList<>();
        for (User u : users) {
            if (u != null && Boolean.TRUE.equals(u.getIsActive())) {
                Notification n = Notification.builder()
                        .userId(u.getId())
                        .type(type)
                        .title(title)
                        .message(message)
                        .metadata(metadata == null ? Map.of() : metadata)
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build();
                batch.add(n);
            }
        }
        if (!batch.isEmpty()) notificationRepository.saveAll(batch);
    }

    @Override
    public void sendToUser(String userId, String type, String title, String message, Map<String, String> meta) {
        NotificationType notifType;
        try { notifType = NotificationType.valueOf(type); } catch (Exception ex) { notifType = NotificationType.GENERIC; }
        sendToUser(userId, notifType, title, message, meta);
    }

    @Override
    public void sendToAllUsers(String type, String title, String message, Map<String, String> meta) {
        NotificationType notifType;
        try { notifType = NotificationType.valueOf(type); } catch (Exception ex) { notifType = NotificationType.GENERIC; }
        sendToAllUsers(notifType, title, message, meta);
    }

    @Override
    public void send(String userId, String content, String link) {
        if (userId == null) return;
        Notification n = Notification.builder()
                .userId(userId)
                .type(NotificationType.GENERIC)
                .title(null)
                .message(content)
                .metadata(link == null ? Map.of() : Map.of("url", link))
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();
        notificationRepository.save(n);
    }

    // ------------------- Read -------------------
    @Override
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUserNotifications(String userId) {
        return getNotificationsForUser(userId);
    }

    @Override
    public List<Notification> getUnreadNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    @Override
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    // ------------------- Mark Read -------------------
    @Override
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Override
    public void markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new ForbiddenException("You cannot modify another user's notification");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        if (!notifications.isEmpty()) notificationRepository.saveAll(notifications);
    }

    // ------------------- Delete -------------------
    @Override
    public void deleteAllNotificationsForUser(String userId) {
        notificationRepository.deleteByUserId(userId);
    }
}
