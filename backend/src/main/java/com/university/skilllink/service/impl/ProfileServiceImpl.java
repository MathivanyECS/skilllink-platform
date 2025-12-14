package com.university.skilllink.service.impl;

import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern; // if not already present at top of file
import java.util.Collections;

import com.university.skilllink.dto.profile.CreateProfileRequest;
import com.university.skilllink.dto.profile.ProfileDTO;
import com.university.skilllink.exception.CustomExceptions.*;
import com.university.skilllink.model.Profile;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.ProfileRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.ProfileService;
import com.university.skilllink.service.WishlistService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final WishlistService wishlistService; // add this to constructor via @RequiredArgsConstructor

    @Override
    @Transactional
    public ProfileDTO createProfile(String userId, CreateProfileRequest request) {
        log.info("Creating profile for user ID: {}", userId);

        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", userId);
                    return new UserNotFoundException("User not found with ID: " + userId);
                });

        // Check if profile already exists
        if (profileRepository.existsByUserId(userId)) {
            log.warn("Profile already exists for user ID: {}", userId);
            throw new ProfileAlreadyExistsException("Profile already exists for this user");
        }

        // Convert DTO skills to entity skills
        List<Profile.SkillToTeach> skillsToTeach = request.getSkillsToTeach() == null
                ? List.of()
                : request.getSkillsToTeach().stream()
                        .map(dto -> Profile.SkillToTeach.builder()
                                .skillName(dto.getSkillName())
                                .proficiency(dto.getProficiency())
                                .yearsOfExperience(dto.getYearsOfExperience())
                                .build())
                        .collect(Collectors.toList());

        // Convert DTO social links to entity social links
        Profile.SocialLinks socialLinks = null;
        if (request.getSocialLinks() != null) {
            socialLinks = Profile.SocialLinks.builder()
                    .linkedin(request.getSocialLinks().getLinkedin())
                    .github(request.getSocialLinks().getGithub())
                    .portfolio(request.getSocialLinks().getPortfolio())
                    .build();
        }

        // Create profile entity
        Profile profile = Profile.builder()
                .userId(userId)
                .profilePicture(request.getProfilePicture())
                .department(request.getDepartment())
                .yearOfStudy(request.getYearOfStudy())
                .bio(request.getBio())
                .phoneNumber(request.getPhoneNumber())
                .skillsToTeach(skillsToTeach)
                .skillsToLearn(request.getSkillsToLearn())
                .statistics(Profile.ProfileStatistics.builder().build())
                .socialLinks(socialLinks)
                .build();

        // Save profile
        Profile savedProfile = profileRepository.save(profile);
        log.info("Profile created successfully for user ID: {}", userId);

        // Update user's profile completion status
        user.setIsProfileCompleted(true);
        userRepository.save(user);
        log.info("Updated profile completion status for user ID: {}", userId);

        // Notify wishlist requesters for any skills provided at creation
        // (case-insensitive, unique)
        if (request.getSkillsToTeach() != null && !request.getSkillsToTeach().isEmpty()) {
            Set<String> seen = new HashSet<>();
            for (var dto : request.getSkillsToTeach()) {
                if (dto == null || dto.getSkillName() == null)
                    continue;
                String raw = dto.getSkillName().trim();
                if (raw.isEmpty())
                    continue;
                String norm = raw.toLowerCase();
                // avoid duplicate notifications when same skill appears multiple times
                if (seen.add(norm)) {
                    try {
                        wishlistService.notifyWhenProviderAdded(raw, userId);
                        log.debug("Notified wishlist requesters for created profile: user={}, skill={}", userId, raw);
                    } catch (Exception ex) {
                        log.error("Failed to notify wishlist requesters on profile creation for skill '{}' user {}: {}",
                                raw, userId, ex.getMessage(), ex);
                    }
                }
            }
        }

        // Convert to DTO and return
        return ProfileDTO.fromProfile(savedProfile, user.getFullName(), user.getEmail());
    }

    @Override
    public ProfileDTO getProfileByUserId(String userId) {
        log.info("Fetching profile for user ID: {}", userId);

        // Find profile
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("Profile not found for user ID: {}", userId);
                    return new ProfileNotFoundException("Profile not found for user ID: " + userId);
                });

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        log.info("Profile fetched successfully for user ID: {}", userId);
        return ProfileDTO.fromProfile(profile, user.getFullName(), user.getEmail());
    }

    @Override
    public List<ProfileDTO> getAllProfiles() {
        log.info("Fetching all profiles");

        List<Profile> profiles = profileRepository.findAll();
        log.info("Found {} profiles", profiles.size());

        return profiles.stream()
                .map(profile -> {
                    User user = userRepository.findById(profile.getUserId()).orElse(null);
                    if (user != null && user.getIsActive()) {
                        return ProfileDTO.fromProfile(profile, user.getFullName(), user.getEmail());
                    }
                    return null;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfileDTO> getProfilesByDepartment(String department) {
        log.info("Fetching profiles by department (case-insensitive): {}", department);

        if (department == null || department.trim().isEmpty()) {
            log.warn("Department search string is empty");
            return Collections.emptyList();
        }

        // Escape any regex special characters for safety
        String safe = Pattern.quote(department.trim());

        // Build regex to match ANYWHERE in the text, case-insensitive
        String regex = "(?i).*" + safe + ".*";

        // Use the new regex repository method
        List<Profile> profiles = profileRepository.findByDepartmentRegex(regex);
        log.info("Found {} profiles matching department filter: {}", profiles.size(), department);

        return profiles.stream()
                .map(profile -> {
                    // Fetch user linked to profile
                    User user = userRepository.findById(profile.getUserId()).orElse(null);
                    if (user != null && Boolean.TRUE.equals(user.getIsActive())) {
                        // Convert to DTO (same as your existing code)
                        return ProfileDTO.fromProfile(
                                profile,
                                user.getFullName(),
                                user.getEmail());
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfileDTO> getProfilesBySkill(String skillName) {
        log.info("Fetching profiles by skill (starts-with, case-insensitive): {}", skillName);

        if (skillName == null || skillName.trim().isEmpty()) {
            // If no search term provided, return all profiles (keeps previous behavior)
            return getAllProfiles();
        }

        // Build a regex anchored to the start of the string to implement "starts-with"
        // Example: "El" -> "^El" ; Pattern.quote prevents regex metacharacters in input
        String sanitized = skillName.trim();
        String regex = "^" + Pattern.quote(sanitized);

        List<Profile> profiles = profileRepository.findBySkillsToTeachSkillNameRegex(regex);
        log.info("Found {} profiles teaching skills starting with '{}'", profiles.size(), sanitized);

        return profiles.stream()
                .map(profile -> {
                    User user = userRepository.findById(profile.getUserId()).orElse(null);
                    if (user != null && user.getIsActive()) {
                        return ProfileDTO.fromProfile(profile, user.getFullName(), user.getEmail());
                    }
                    return null;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfileDTO> getProfilesByDepartmentAndYear(String department, Integer yearOfStudy) {
        log.info("Fetching profiles by department: {} and year: {}", department, yearOfStudy);

        List<Profile> profiles = profileRepository.findByDepartmentAndYearOfStudy(department, yearOfStudy);
        log.info("Found {} profiles matching criteria", profiles.size());

        return profiles.stream()
                .map(profile -> {
                    User user = userRepository.findById(profile.getUserId()).orElse(null);
                    if (user != null && user.getIsActive()) {
                        return ProfileDTO.fromProfile(profile, user.getFullName(), user.getEmail());
                    }
                    return null;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProfileDTO updateProfile(String userId, CreateProfileRequest request) {
        log.info("Updating profile for user ID: {}", userId);

        // Find existing profile
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("Profile not found for user ID: {}", userId);
                    return new ProfileNotFoundException("Profile not found for user ID: " + userId);
                });

        // --- normalize existing skills (lowercase trimmed) for comparison ---
        List<String> oldSkills = profile.getSkillsToTeach() == null
                ? List.of()
                : profile.getSkillsToTeach().stream()
                        .map(Profile.SkillToTeach::getSkillName)
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());

        Set<String> oldNormalized = oldSkills.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        // --- build incoming skill list (trimmed) and a map norm -> original ---
        List<Profile.SkillToTeach> skillsToTeach = request.getSkillsToTeach() == null
                ? List.of()
                : request.getSkillsToTeach().stream()
                        .map(dto -> Profile.SkillToTeach.builder()
                                .skillName(dto.getSkillName())
                                .proficiency(dto.getProficiency())
                                .yearsOfExperience(dto.getYearsOfExperience())
                                .build())
                        .collect(Collectors.toList());

        List<String> newSkillList = skillsToTeach.stream()
                .map(Profile.SkillToTeach::getSkillName)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        // normalize incoming and map normalized -> first original casing
        Map<String, String> normToOriginal = new HashMap<>();
        Set<String> newNormalized = newSkillList.stream()
                .map(s -> {
                    String n = s.toLowerCase();
                    normToOriginal.putIfAbsent(n, s); // keep first original form
                    return n;
                })
                .collect(Collectors.toSet());

        // compute added = newNormalized - oldNormalized (case-insensitive)
        Set<String> addedNormalized = new HashSet<>(newNormalized);
        addedNormalized.removeAll(oldNormalized);

        // Update basic fields
        profile.setProfilePicture(request.getProfilePicture());
        profile.setDepartment(request.getDepartment());
        profile.setYearOfStudy(request.getYearOfStudy());
        profile.setBio(request.getBio());
        profile.setPhoneNumber(request.getPhoneNumber());

        // Update skills to teach (we already constructed skillsToTeach above)
        profile.setSkillsToTeach(skillsToTeach);

        // Update skills to learn
        profile.setSkillsToLearn(request.getSkillsToLearn());

        // Update social links
        if (request.getSocialLinks() != null) {
            Profile.SocialLinks socialLinks = Profile.SocialLinks.builder()
                    .linkedin(request.getSocialLinks().getLinkedin())
                    .github(request.getSocialLinks().getGithub())
                    .portfolio(request.getSocialLinks().getPortfolio())
                    .build();
            profile.setSocialLinks(socialLinks);
        }

        // Save updated profile
        Profile updatedProfile = profileRepository.save(profile);
        log.info("Profile updated successfully for user ID: {}", userId);

        // Notify wishlist requesters for newly added skills (preserve original casing)
        if (!addedNormalized.isEmpty()) {
            for (String normSkill : addedNormalized) {
                String originalSkill = normToOriginal.getOrDefault(normSkill, normSkill);
                try {
                    wishlistService.notifyWhenProviderAdded(originalSkill, userId);
                    log.info("Notified wishlist requesters: user={} added skill='{}'", userId, originalSkill);
                } catch (Exception ex) {
                    log.error("Failed to notify wishlist requesters for skill '{}' by provider {}: {}", originalSkill,
                            userId, ex.getMessage(), ex);
                }
            }
        } else {
            log.debug("No new skills to notify for user {}", userId);
        }

        // Get user info
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return ProfileDTO.fromProfile(updatedProfile, user.getFullName(), user.getEmail());
    }

    @Override
    @Transactional
    public void deleteProfile(String userId) {
        log.info("Deleting profile for user ID: {}", userId);

        // Find profile
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("Profile not found for user ID: {}", userId);
                    return new ProfileNotFoundException("Profile not found for user ID: " + userId);
                });

        // Delete profile
        profileRepository.delete(profile);
        log.info("Profile deleted successfully for user ID: {}", userId);

        // Update user's profile completion status
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setIsProfileCompleted(false);
            userRepository.save(user);
            log.info("Updated profile completion status to false for user ID: {}", userId);
        }
    }

    @Override
    public boolean profileExists(String userId) {
        boolean exists = profileRepository.existsByUserId(userId);
        log.info("Profile exists check for user ID {}: {}", userId, exists);
        return exists;
    }

    // --- Added methods required by ProfileService interface ---

    @Override
    public List<ProfileDTO> getProfilesByYear(Integer year) {
        log.info("Fetching profiles by year: {}", year);
        List<Profile> profiles = profileRepository.findByYearOfStudy(year);

        return profiles.stream()
                .map(profile -> {
                    User user = userRepository.findById(profile.getUserId()).orElse(null);
                    if (user != null && user.getIsActive()) {
                        return ProfileDTO.fromProfile(profile, user.getFullName(), user.getEmail());
                    }
                    return null;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfileDTO> getProfilesBySkillPrefix(String prefix) {
        log.info("Fetching profiles by skill prefix: {}", prefix);

        if (prefix == null || prefix.trim().isEmpty()) {
            return getAllProfiles();
        }

        String sanitized = prefix.trim();
        String regex = "^" + java.util.regex.Pattern.quote(sanitized);

        List<Profile> profiles = profileRepository.findBySkillsToTeachSkillNameRegex(regex);

        return profiles.stream()
                .map(profile -> {
                    User user = userRepository.findById(profile.getUserId()).orElse(null);
                    if (user != null && user.getIsActive()) {
                        return ProfileDTO.fromProfile(profile, user.getFullName(), user.getEmail());
                    }
                    return null;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
}
