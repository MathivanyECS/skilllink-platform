package com.university.skilllink.controller.admin;

import com.university.skilllink.dto.auth.AdminRegisterRequest;
import com.university.skilllink.dto.auth.RegisterRequest;
import com.university.skilllink.dto.auth.UserDTO;
import com.university.skilllink.dto.profile.OfferedSkillDTO;
import com.university.skilllink.dto.admin.ActiveUserDTO;
import com.university.skilllink.dto.admin.CollabStatsDTO;
import com.university.skilllink.dto.admin.SkillGapReportDTO;
import com.university.skilllink.dto.admin.TopSkillProviderDTO;
import com.university.skilllink.dto.collaboration.CollabPostDTO;
import com.university.skilllink.service.AuthService;
import com.university.skilllink.service.CollaborationService;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.UserService;
import com.university.skilllink.model.Notification;
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
    private final NotificationService notificationService;
    private final CollaborationService collaborationService;

    // -------- CREATE ADMIN --------
    @PostMapping("/create")
    public ResponseEntity<UserDTO> createAdmin(@RequestBody AdminRegisterRequest request) {
        RegisterRequest adminRegister = new RegisterRequest();
        adminRegister.setFullName(request.getFullName());
        adminRegister.setEmail(request.getEmail());
        adminRegister.setPassword(request.getPassword());
        adminRegister.setRole("ADMIN");
        adminRegister.setStudentId(null); // no student ID for admin
        return ResponseEntity.ok(authService.register(adminRegister).getUser());
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

    // --- NOTIFICATIONS ---
    @GetMapping("/users/{id}/notifications")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable("id") String userId) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @DeleteMapping("/users/{id}/notifications")
    public ResponseEntity<String> clearUserNotifications(@PathVariable("id") String userId) {
        notificationService.deleteAllNotificationsForUser(userId);
        return ResponseEntity.ok("Notifications deleted successfully");
    }

    // --- ACTIVE USERS ---
    @GetMapping("/active-users")
    public ResponseEntity<List<ActiveUserDTO>> getAllActiveUsers() {
        List<ActiveUserDTO> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(users);
    }

    // --- COLLABORATION POSTS MANAGEMENT (ADMIN) ---
    @GetMapping("/collaboration-posts")
    public ResponseEntity<List<CollabPostDTO>> getAllCollaborationPosts() {
        List<CollabPostDTO> posts = collaborationService.getAllPosts(); // admin sees all posts
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/collaboration-posts/{id}")
    public ResponseEntity<String> deleteCollaborationPost(@PathVariable("id") String postId) {
        collaborationService.deletePostByAdmin(postId); // new admin delete method
        return ResponseEntity.ok("Collaboration post deleted successfully by admin");
    }

    // --- ADMIN REPORTS ---
    @GetMapping("/reports/top-skill-providers")
    public ResponseEntity<List<TopSkillProviderDTO>> getTopSkillProviders() {
        return ResponseEntity.ok(userService.getTopSkillProviders());
    }

    //--- SKILL GAP REPORT ---
    @GetMapping("/reports/skill-gap")
    public ResponseEntity<List<SkillGapReportDTO>> getSkillGapReport() {
    return ResponseEntity.ok(userService.getSkillGapReport());
    }

    //--- COLLABORATION STATS ---
    @GetMapping("/reports/collaboration-stats")
    public ResponseEntity<CollabStatsDTO> getCollaborationStats() {
    CollabStatsDTO stats = userService.getCollaborationStats();
    return ResponseEntity.ok(stats);
    }

}