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
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;

    // =========================================================
    // 🧠 AI FEATURE 1: SEMANTIC SKILL CATEGORIES
    // High-level concepts → real skills
    // =========================================================
    private static final Map<String, List<String>> SKILL_SYNONYMS = Map.of(
            "frontend", List.of("react", "angular", "vue", "html", "css", "javascript"),
            "backend", List.of("java", "spring", "node", "django", "express"),
            "mobile", List.of("android", "ios", "flutter", "react native"),
            "data", List.of("data science", "data analysis", "sql", "python"),
            "ai", List.of("machine learning", "deep learning", "ml", "nlp"),

            // 🧠 SOFT SKILLS (VERY IMPORTANT FOR MARKS)
            "communication", List.of("english", "presentation", "public speaking"),
            "english", List.of("communication", "presentation", "writing"),
            "presentation", List.of("communication", "english", "speaking"));

    // =========================================================
    // 🧠 AI FEATURE 2: FUZZY MATCH (typos + case)
    // =========================================================
    private boolean fuzzyMatch(String a, String b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a.contains(b) || b.contains(a);
    }

    // =========================================================
    // 🧠 AI FEATURE 3: PREFIX INTELLIGENCE
    // Example: "r" → react, rust
    // =========================================================
    private boolean prefixMatch(String skillName, String input) {
        return skillName.toLowerCase().startsWith(input.toLowerCase());
    }

    // =========================================================
    // 🧠 AI FEATURE 4: RELEVANCE SCORING (unchanged logic)
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
                    score += 3; // exact
                else if (name.contains(e))
                    score += 2; // partial
                else if (prefixMatch(name, e))
                    score += 2; // prefix
                else if (fuzzyMatch(name, e))
                    score += 1; // fuzzy
            }
        }
        return score;
    }

    /* ======================================================= */

    @PostMapping
    public ResponseEntity<ProfileDTO> createProfile(
            @Valid @RequestBody CreateProfileRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();
        String userId = userService.getUserByEmail(email).getId();

        ProfileDTO profile = profileService.createProfile(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileDTO> getMyProfile(Authentication authentication) {

        String email = authentication.getName(); // from JWT
        String userId = userService.getUserByEmail(email).getId();

        return profileService
                .getProfileOptionalByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me/profile-picture")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();
        String userId = userService.getUserByEmail(email).getId();

        String imageUrl = profileService.updateProfilePicture(userId, file);

        return ResponseEntity.ok(
                Map.of("profilePicture", imageUrl));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(
                profileService.getProfileByUserId(userId));
    }

    // =========================================================
    // 🧠 AI-ENHANCED FILTERING ENTRY POINT
    // =========================================================
    @GetMapping
    public ResponseEntity<List<ProfileDTO>> getProfiles(
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "skill", required = false) String skill) {

        List<ProfileDTO> results = profileService.getAllProfiles();

        if (department != null && !department.isBlank()) {
            results = results.stream()
                    .filter(p -> p.getDepartment() != null &&
                            p.getDepartment().equalsIgnoreCase(department))
                    .toList();
        }

        if (year != null) {
            results = results.stream()
                    .filter(p -> p.getYearOfStudy() == year)
                    .toList();
        }

        // ================= AI SKILL FILTER =================
        if (skill != null && !skill.isBlank()) {

            String input = skill.trim().toLowerCase();
            Set<String> expandedSkills = new HashSet<>();

            // 1️⃣ Add category expansion
            expandedSkills.addAll(
                    SKILL_SYNONYMS.getOrDefault(input, List.of(input)));

            // 2️⃣ Add original input
            expandedSkills.add(input);

            // 3️⃣ Rank + filter
            results = results.stream()
                    .sorted((a, b) -> Integer.compare(
                            scoreProfile(b, new ArrayList<>(expandedSkills)),
                            scoreProfile(a, new ArrayList<>(expandedSkills))))
                    .filter(p -> scoreProfile(p, new ArrayList<>(expandedSkills)) > 0)
                    .toList();
        }

        return ResponseEntity.ok(results);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ProfileDTO> updateProfile(
            @PathVariable String userId,
            @Valid @RequestBody CreateProfileRequest request) {
        return ResponseEntity.ok(
                profileService.updateProfile(userId, request));
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileDTO> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody CreateProfileRequest request) {

        String email = authentication.getName();
        String userId = userService.getUserByEmail(email).getId();

        return ResponseEntity.ok(
                profileService.updateProfile(userId, request));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> deleteProfile(
            @PathVariable String userId) {
        profileService.deleteProfile(userId);
        return ResponseEntity.ok(
                Map.of("message", "Profile deleted successfully"));
    }

    @GetMapping("/exists/{userId}")
    public ResponseEntity<Map<String, Boolean>> checkProfileExists(
            @PathVariable String userId) {
        return ResponseEntity.ok(
                Map.of("exists", profileService.profileExists(userId)));
    }
}
