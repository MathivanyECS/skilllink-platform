package com.university.skilllink.controller;

import com.university.skilllink.model.Notification;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Notification>> getCurrentUserNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String userId = userService.getUserByEmail(email).getId();
        List<Notification> list = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(list);
    }
}
