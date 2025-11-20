package com.university.skilllink.service;

import com.university.skilllink.model.Notification;

import java.util.List;
import java.util.Map;

public interface NotificationService {
    Notification sendToUser(String userId, String type, String title, String message, Map<String,String> metadata);
    void sendToAllUsers(String type, String title, String message, Map<String,String> metadata);
    List<Notification> getNotificationsForUser(String userId);
}
