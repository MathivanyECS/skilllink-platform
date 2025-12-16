package com.university.skilllink.controller;

import com.university.skilllink.dto.profile.CreateProfileRequest;
import com.university.skilllink.dto.profile.ProfileDTO;
import com.university.skilllink.service.ProfileService;
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
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;

    /**
     * Create profile for current user
     */
    @PostMapping
    public ResponseEntity<ProfileDTO> createProfile(@Valid @RequestBody CreateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // Resolve userId from email via UserService
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
     * Combined endpoint for filtering / listing profiles.
     *
     * Query params:
     * - department (optional)
     * - year (optional) integer
     * - skill (optional) prefix search (starts-with, case-insensitive)
     *
     * Examples:
     * GET /api/profiles?skill=El
     * GET /api/profiles?department=Electronics&year=3
     * GET /api/profiles?year=2
     * GET /api/profiles -> returns all
     */
    @GetMapping
    public ResponseEntity<List<ProfileDTO>> getProfiles(
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "skill", required = false) String skill) {
        // skill search takes priority (prefix search)
        if (skill != null && !skill.trim().isEmpty()) {
            List<ProfileDTO> results = profileService.getProfilesBySkillPrefix(skill.trim());
            return ResponseEntity.ok(results);
        }

        // both department and year present
        if (department != null && !department.trim().isEmpty() && year != null) {
            List<ProfileDTO> results = profileService.getProfilesByDepartmentAndYear(department.trim(), year);
            return ResponseEntity.ok(results);
        }

        // only department present
        if (department != null && !department.trim().isEmpty()) {
            List<ProfileDTO> results = profileService.getProfilesByDepartment(department.trim());
            return ResponseEntity.ok(results);
        }

        // only year present
        if (year != null) {
            List<ProfileDTO> results = profileService.getProfilesByYear(year);
            return ResponseEntity.ok(results);
        }

        // no filters -> all
        List<ProfileDTO> results = profileService.getAllProfiles();
        return ResponseEntity.ok(results);
    }

    /**
     * Update profile for a user (by userId)
     */
    @PutMapping("/{userId}")
    public ResponseEntity<ProfileDTO> updateProfile(
            @PathVariable String userId,
            @Valid @RequestBody CreateProfileRequest request) {
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
