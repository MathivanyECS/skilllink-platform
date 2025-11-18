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
    public Notification send(String receiverId, Notification.NotificationType type, String content, String link) {
        Notification n = Notification.builder()
                .receiverId(receiverId)
                .type(type)
                .content(content)
                .link(link)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(n);
    }

    @Override
    public List<Notification> getNotifications(String receiverId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId);
    }

    @Override
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            // correct setter name for boolean field 'isRead' is setRead(...)
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Override
    public void markAllAsRead(String receiverId) {
        notificationRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId)
                .forEach(n -> {
                    if (!n.isRead()) {
                        n.setRead(true);
                        notificationRepository.save(n);
                    }
                });
    }

    @Override
    public long countUnread(String receiverId) {
        return notificationRepository.countByReceiverIdAndIsReadFalse(receiverId);
    }
}
