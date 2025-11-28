package com.university.skilllink.controller.admin;

import com.university.skilllink.dto.auth.UserDTO;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    // --- USER MANAGEMENT ---

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    // Deactivate user
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable("id") String userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok("User deactivated successfully");
    }

    // Activate user
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<String> activateUser(@PathVariable("id") String userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok("User activated successfully");
    }

    // --- SKILL MANAGEMENT ---

    // Get offered skills for a user
    @GetMapping("/users/{id}/offered-skills")
    public ResponseEntity<List<String>> getOfferedSkills(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.getUserOfferedSkills(userId));
    }

    // Get desired skills for a user
    @GetMapping("/users/{id}/desired-skills")
    public ResponseEntity<List<String>> getDesiredSkills(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.getUserDesiredSkills(userId));
    }

    // --- NOTIFICATIONS ---

    // Get all notifications for a user
    @GetMapping("/users/{id}/notifications")
    public ResponseEntity<List<String>> getUserNotifications(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.getNotifications(userId));
    }

    // Clear notifications for a user
    @DeleteMapping("/users/{id}/notifications")
    public ResponseEntity<String> clearUserNotifications(@PathVariable("id") String userId) {
        userService.clearNotifications(userId);
        return ResponseEntity.ok("Notifications cleared successfully");
    }

    // --- ACTIVE USERS ---

    // Get all active user IDs (for analytics / admin dashboard)
    @GetMapping("/active-users")
    public ResponseEntity<List<String>> getAllActiveUserIds() {
        return ResponseEntity.ok(userService.getAllActiveUserIds());
    }

}
