package com.university.skilllink.service.impl;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.NotificationType;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.NotificationRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public Notification sendToUser(String userId, NotificationType type, String title, String message, Map<String, String> metadata) {
        if (userId == null) return null;
        Notification n = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .metadata(metadata)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(n);
    }

    @Override
    public void sendToAllUsers(NotificationType type, String title, String message, Map<String, String> metadata) {
        List<User> users = userRepository.findAll(); // you can replace with a method to fetch only active users
        List<Notification> batch = new ArrayList<>();
        for (User u : users) {
            if (u != null && Boolean.TRUE.equals(u.getIsActive())) {
                Notification n = Notification.builder()
                        .userId(u.getId())
                        .type(type)
                        .title(title)
                        .message(message)
                        .metadata(metadata)
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build();
                batch.add(n);
            }
        }
        if (!batch.isEmpty()) {
            notificationRepository.saveAll(batch);
        }
    }

    @Override
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUnreadNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    @Override
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Override
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Override
    public void markAllAsRead(String userId) {
        List<Notification> list = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        for (Notification n : list) {
            n.setRead(true);
        }
        if (!list.isEmpty()) notificationRepository.saveAll(list);
    }

    /**
     * Proper implementation of createNotification used by other services (e.g. RequestService).
     * Ensures createdAt and read default values are set and saves to repository.
     */
    @Override
    public Notification createNotification(Notification notification) {
        if (notification == null) return null;

        // If provided userId is not associated with an existing user, we still save the notification
        // but you can uncomment validation below if you want to reject invalid userIds:
        // if (!userRepository.existsById(notification.getUserId())) throw new IllegalArgumentException("Invalid userId");

        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        if (notification.getRead() == null) {
            notification.setRead(false);
        }
        // ensure metadata is not null (optional)
        if (notification.getMetadata() == null) {
            notification.setMetadata(Map.of());
        }

        return notificationRepository.save(notification);
    }
}
