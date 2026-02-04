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

    // =========================================================
    // 🧠 AI FEATURE 1: SEMANTIC SKILL KNOWLEDGE BASE
    // ---------------------------------------------------------
    // This is NOT an exhaustive skill list.
    // These are HIGH-LEVEL semantic categories.
    // Any unknown skill is still handled dynamically.
    // =========================================================
    private static final Map<String, List<String>> SKILL_SYNONYMS = Map.of(
            "frontend", List.of("react", "angular", "vue", "html", "css", "javascript"),
            "backend", List.of("java", "spring", "node", "django", "express"),
            "mobile", List.of("android", "ios", "flutter", "react native"),
            "data", List.of("data science", "data analysis", "sql", "python"),
            "ai", List.of("machine learning", "deep learning", "ml", "nlp"));

    // =========================================================
    // 🧠 AI FEATURE 2: FUZZY MATCHING (TYPO TOLERANCE)
    // Handles user typing mistakes like "recat", "pythn"
    // =========================================================
    private boolean fuzzyMatch(String a, String b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a.contains(b) || b.contains(a);
    }

    // =========================================================
    // 🧠 AI FEATURE 3: RELEVANCE SCORING (INTELLIGENT RANKING)
    // Exact match > partial match > fuzzy match
    // =========================================================
    private int scoreProfile(ProfileDTO profile, List<String> expandedSkills) {
        if (profile.getSkillsToTeach() == null)
            return 0;

        int score = 0;
        for (var sk : profile.getSkillsToTeach()) {
            if (sk.getSkillName() == null)
                continue;

            String name = sk.getSkillName().toLowerCase();
            for (String e : expandedSkills) {
                if (name.equals(e))
                    score += 3; // exact match
                else if (name.contains(e))
                    score += 2; // partial match
                else if (fuzzyMatch(name, e))
                    score += 1;// fuzzy match
            }
        }
        return score;
    }

    /**
     * Create profile for current user
     */
    @PostMapping
    public ResponseEntity<ProfileDTO> createProfile(@Valid @RequestBody CreateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String userId = userService.getUserByEmail(email).getId();

        ProfileDTO profile = profileService.createProfile(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    /**
     * Get profile by user ID
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }

    /**
     * Combined filtering with AI-enhanced skill intelligence
     */
    @GetMapping
    public ResponseEntity<List<ProfileDTO>> getProfiles(
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "skill", required = false) String skill) {

        // 1️⃣ Get all profiles (existing safe logic)
        List<ProfileDTO> results = profileService.getAllProfiles();

        // 2️⃣ Filter by department
        if (department != null && !department.trim().isEmpty()) {
            results = results.stream()
                    .filter(p -> p.getDepartment() != null &&
                            p.getDepartment().equalsIgnoreCase(department.trim()))
                    .toList();
        }

        // 3️⃣ Filter by year
        if (year != null) {
            results = results.stream()
                    .filter(p -> p.getYearOfStudy() == year)
                    .toList();
        }

        // =====================================================
        // 🧠 AI-ENHANCED SKILL FILTERING (SAFE ADDITION)
        // =====================================================
        if (skill != null && !skill.trim().isEmpty()) {

            String input = skill.trim().toLowerCase();

            // AI semantic expansion
            List<String> expandedSkills = SKILL_SYNONYMS.getOrDefault(input, List.of(input));

            // AI relevance ranking + filtering
            results = results.stream()
                    .sorted((p1, p2) -> Integer.compare(
                            scoreProfile(p2, expandedSkills),
                            scoreProfile(p1, expandedSkills)))
                    .filter(p -> scoreProfile(p, expandedSkills) > 0)
                    .toList();
        }

        return ResponseEntity.ok(results);
    }

    /**
     * Update profile
     */
    @PutMapping("/{userId}")
    public ResponseEntity<ProfileDTO> updateProfile(
            @PathVariable String userId,
            @Valid @RequestBody CreateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(userId, request));
    }

    /**
     * Delete profile
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> deleteProfile(@PathVariable String userId) {
        profileService.deleteProfile(userId);
        return ResponseEntity.ok(Map.of("message", "Profile deleted successfully"));
    }

    /**
     * Check profile existence
     */
    @GetMapping("/exists/{userId}")
    public ResponseEntity<Map<String, Boolean>> checkProfileExists(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("exists", profileService.profileExists(userId)));
    }
}
