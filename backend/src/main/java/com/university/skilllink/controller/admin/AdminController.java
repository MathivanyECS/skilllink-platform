package com.university.skilllink.controller.admin;

import com.university.skilllink.dto.auth.RegisterRequest;
import com.university.skilllink.dto.auth.UserDTO;
import com.university.skilllink.dto.profile.OfferedSkillDTO;
import com.university.skilllink.service.AuthService;
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
    private final AuthService authService;

    // -------- CREATE ADMIN --------
    @PostMapping("/create")
    public ResponseEntity<UserDTO> createAdmin(@RequestBody RegisterRequest request) {
        request.setRole("ADMIN");
        return ResponseEntity.ok(authService.register(request).getUser());
    }

    // --- USER MANAGEMENT ---
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable("id") String userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok("User deactivated successfully");
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<String> activateUser(@PathVariable("id") String userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok("User activated successfully");
    }

    // --- SKILLS ---
    @GetMapping("/users/{id}/offered-skills")
    public ResponseEntity<List<OfferedSkillDTO>> getOfferedSkills(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.getUserOfferedSkillsDetailed(userId));
    }

    @GetMapping("/users/{id}/desired-skills")
    public ResponseEntity<List<String>> getDesiredSkills(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.getUserDesiredSkills(userId));
    }

    @PostMapping("/users/{id}/offered-skills")
    public ResponseEntity<String> addOfferedSkill(@PathVariable("id") String userId,
                                                  @RequestParam String skill) {
        userService.addOfferedSkill(userId, skill);
        return ResponseEntity.ok("Offered skill added successfully");
    }

    @PostMapping("/users/{id}/desired-skills")
    public ResponseEntity<String> addDesiredSkill(@PathVariable("id") String userId,
                                                  @RequestParam String skill) {
        userService.addDesiredSkill(userId, skill);
        return ResponseEntity.ok("Desired skill added successfully");
    }

    // --- NOTIFICATIONS ---
    @GetMapping("/users/{id}/notifications")
    public ResponseEntity<List<String>> getUserNotifications(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.getNotifications(userId));
    }

    @DeleteMapping("/users/{id}/notifications")
    public ResponseEntity<String> clearUserNotifications(@PathVariable("id") String userId) {
        userService.clearNotifications(userId);
        return ResponseEntity.ok("Notifications cleared successfully");
    }

    // --- ACTIVE USERS ---
    @GetMapping("/active-users")
    public ResponseEntity<List<String>> getAllActiveUserIds() {
        return ResponseEntity.ok(userService.getAllActiveUserIds());
    }
}
