package com.university.skilllink.controller;

import com.university.skilllink.dto.profile.CreateProfileRequest;
import com.university.skilllink.dto.profile.ProfileDTO;
import com.university.skilllink.service.ProfileService; // ← Import interface
import com.university.skilllink.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProfileController {

    private final ProfileService profileService;
      private final UserService userService;
    // ← Inject interface, not implementation

    /**
     * Create profile for current user
     */
    @PostMapping
    public ResponseEntity<ProfileDTO> createProfile(@Valid @RequestBody CreateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // TODO: Get userId from email via UserService
        // For now, you'll need to add a method to get userId from email
         String userId = userService.getUserByEmail(email).getId();

        ProfileDTO profile = profileService.createProfile(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    /**
     * Get profile by user ID
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable String userId) {
        ProfileDTO profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    /**
     * Get all profiles (for dashboard)
     */
    @GetMapping
    public ResponseEntity<List<ProfileDTO>> getAllProfiles() {
        List<ProfileDTO> profiles = profileService.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    /**
     * Filter profiles by department
     */
    @GetMapping("/department/{department}")
    public ResponseEntity<List<ProfileDTO>> getProfilesByDepartment(@PathVariable String department) {
        List<ProfileDTO> profiles = profileService.getProfilesByDepartment(department);
        return ResponseEntity.ok(profiles);
    }

    /**
     * Filter profiles by skill
     */
    @GetMapping("/skill/{skillName}")
    public ResponseEntity<List<ProfileDTO>> getProfilesBySkill(@PathVariable String skillName) {
        List<ProfileDTO> profiles = profileService.getProfilesBySkill(skillName);
        return ResponseEntity.ok(profiles);
    }

    /**
     * Filter profiles by department and year
     */
    @GetMapping("/filter")
    public ResponseEntity<List<ProfileDTO>> getProfilesByDepartmentAndYear(
            @RequestParam String department,
            @RequestParam Integer year
    ) {
        List<ProfileDTO> profiles = profileService.getProfilesByDepartmentAndYear(department, year);
        return ResponseEntity.ok(profiles);
    }

    /**
     * Update profile for current user
     */
    @PutMapping("/{userId}")
    public ResponseEntity<ProfileDTO> updateProfile(
            @PathVariable String userId,
            @Valid @RequestBody CreateProfileRequest request
    ) {
        ProfileDTO profile = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

    /**
     * Delete profile
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> deleteProfile(@PathVariable String userId) {
        profileService.deleteProfile(userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile deleted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Check if profile exists
     */
    @GetMapping("/exists/{userId}")
    public ResponseEntity<Map<String, Boolean>> checkProfileExists(@PathVariable String userId) {
        boolean exists = profileService.profileExists(userId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}