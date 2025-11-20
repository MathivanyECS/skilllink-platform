package com.university.skilllink.service.impl;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.NotificationRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public Notification sendToUser(String userId, String type, String title, String message, Map<String, String> metadata) {
        Notification n = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .metadata(metadata)
                .read(false)
                .build();
        return notificationRepository.save(n);
    }

    @Override
    public void sendToAllUsers(String type, String title, String message, Map<String, String> metadata) {
        // get all active users only
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
}
