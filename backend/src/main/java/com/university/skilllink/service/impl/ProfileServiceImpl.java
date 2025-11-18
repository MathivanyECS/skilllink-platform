package com.university.skilllink.service.impl;

import com.university.skilllink.dto.profile.CreateProfileRequest;
import com.university.skilllink.dto.profile.ProfileDTO;
import com.university.skilllink.exception.CustomExceptions.*;
import com.university.skilllink.model.Profile;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.ProfileRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

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
        List<Profile.SkillToTeach> skillsToTeach = request.getSkillsToTeach().stream()
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
        log.info("Fetching profiles by department: {}", department);

        List<Profile> profiles = profileRepository.findByDepartment(department);
        log.info("Found {} profiles in department: {}", profiles.size(), department);

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
    public List<ProfileDTO> getProfilesBySkill(String skillName) {
        log.info("Fetching profiles by skill: {}", skillName);

        List<Profile> profiles = profileRepository.findBySkillsToTeachSkillName(skillName);
        log.info("Found {} profiles teaching skill: {}", profiles.size(), skillName);

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

        // Update basic fields
        profile.setProfilePicture(request.getProfilePicture());
        profile.setDepartment(request.getDepartment());
        profile.setYearOfStudy(request.getYearOfStudy());
        profile.setBio(request.getBio());
        profile.setPhoneNumber(request.getPhoneNumber());

        // Update skills to teach
        List<Profile.SkillToTeach> skillsToTeach = request.getSkillsToTeach().stream()
                .map(dto -> Profile.SkillToTeach.builder()
                        .skillName(dto.getSkillName())
                        .proficiency(dto.getProficiency())
                        .yearsOfExperience(dto.getYearsOfExperience())
                        .build())
                .collect(Collectors.toList());
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
}
