package com.university.skilllink.service.impl;

import com.university.skilllink.exception.ForbiddenException;
import com.university.skilllink.exception.ResourceNotFoundException;
import com.university.skilllink.model.Notification;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.NotificationRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void send(String userId, Notification.NotificationType type, String content, String link) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .content(content)
                .link(link)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
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
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Override
    public void sendToUser(String userId, String type, String title, String message, Map<String, String> meta) {
        String content = title + "\n" + message + "\nMeta: " + meta.toString();

        Notification.NotificationType notifType;
        try {
            notifType = Notification.NotificationType.valueOf(type);
        } catch (IllegalArgumentException ex) {
            notifType = Notification.NotificationType.NEW_REQUEST;
        }

        send(userId, notifType, content, meta.getOrDefault("url", ""));
    }

    @Override
    public void sendToAllUsers(String type, String title, String message, Map<String, String> meta) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            sendToUser(user.getId(), type, title, message, meta);
        }
    }
}