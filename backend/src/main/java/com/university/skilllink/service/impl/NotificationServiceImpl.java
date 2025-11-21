package com.university.skilllink.service.impl;

import com.university.skilllink.model.Notification;
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

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // Send notification to a single user (HEAD branch method)
    @Override
    public Notification sendToUser(String userId, String type, String title, String message, Map<String, String> metadata) {
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

    // Send notification to all users (HEAD branch method)
    @Override
    public void sendToAllUsers(String type, String title, String message, Map<String, String> metadata) {
        List<User> users = userRepository.findAll();
        List<Notification> batch = new ArrayList<>();
        for (User u : users) {
            if (u.getIsActive()) {
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

    // Alternative send method (feature branch)
    @Override
    public void send(String receiverId, Notification.NotificationType type, String content, String link) {
        Notification notification = Notification.builder()
                .receiverId(receiverId)
                .type(type)
                .content(content)
                .link(link)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
    }

    // Get notifications for a user
    @Override
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    // Mark a notification as read
    @Override
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.markAsRead(); // make sure Notification class has this method
            notificationRepository.save(n);
        });
    }
}
