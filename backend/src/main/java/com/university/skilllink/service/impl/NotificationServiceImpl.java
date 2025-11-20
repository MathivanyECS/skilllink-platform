package com.university.skilllink.service.impl;

import com.university.skilllink.model.Notification;
import com.university.skilllink.repository.NotificationRepository;
import com.university.skilllink.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

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

    @Override
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.markAsRead();
            notificationRepository.save(n);
        });
    }
}
