package com.university.skilllink.service.impl;

import com.university.skilllink.dto.auth.UserDTO;
import com.university.skilllink.dto.profile.OfferedSkillDTO;
import com.university.skilllink.dto.admin.ActiveUserDTO;
import com.university.skilllink.dto.admin.SkillDemandDTO;
import com.university.skilllink.exception.CustomExceptions.UserNotFoundException;
import com.university.skilllink.model.Profile;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.ProfileRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    // ---------------- User retrieval ----------------

    @Override
    public UserDTO getUserById(String userId) {
        return UserDTO.fromUser(findUserById(userId));
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return UserDTO.fromUser(
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UserNotFoundException("User not found with email: " + email))
        );
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toList());
    }

    // ---------------- Profile management ----------------

    @Override
    public void updateProfileCompletionStatus(String userId, boolean isCompleted) {
        User user = findUserById(userId);
        user.setIsProfileCompleted(isCompleted);
        userRepository.save(user);
    }

    @Override
    public boolean isProfileCompleted(String userId) {
        return findUserById(userId).getIsProfileCompleted();
    }

    // ---------------- Activation ----------------

    @Override
    public void deactivateUser(String userId) {
        User user = findUserById(userId);
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    public void activateUser(String userId) {
        User user = findUserById(userId);
        user.setIsActive(true);
        userRepository.save(user);
    }

    @Override
    public List<String> getAllActiveUserIds() {
        return userRepository.findAll()
                .stream()
                .filter(User::getIsActive)
                .map(User::getId)
                .collect(Collectors.toList());
    }

    @Override
    public List<ActiveUserDTO> getAllActiveUsers() {
        return userRepository.findAll()
                .stream()
                .filter(User::getIsActive)
                .map(user -> ActiveUserDTO.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .collect(Collectors.toList());
    }

    // ---------------- Skills management ----------------

    @Override
    public List<String> getUserOfferedSkills(String userId) {
        Profile profile = getProfile(userId);
        return profile.getSkillsToTeach()
                .stream()
                .map(Profile.SkillToTeach::getSkillName)
                .toList();
    }

    @Override
    public List<OfferedSkillDTO> getUserOfferedSkillsDetailed(String userId) {
        Profile profile = getProfile(userId);
        return profile.getSkillsToTeach()
                .stream()
                .map(OfferedSkillDTO::fromSkill)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getUserDesiredSkills(String userId) {
        return new ArrayList<>(getProfile(userId).getSkillsToLearn());
    }

    @Override
    public void addOfferedSkill(String userId, String skill) {
        Profile profile = getProfile(userId);

        boolean exists = profile.getSkillsToTeach()
                .stream()
                .anyMatch(s -> s.getSkillName().equalsIgnoreCase(skill));

        if (!exists) {
            profile.getSkillsToTeach().add(
                    Profile.SkillToTeach.builder()
                            .skillName(skill)
                            .proficiency(Profile.SkillProficiency.BEGINNER)
                            .yearsOfExperience(0)
                            .build()
            );
            profileRepository.save(profile);
        }
    }

    @Override
    public void removeOfferedSkill(String userId, String skill) {
        Profile profile = getProfile(userId);
        profile.getSkillsToTeach()
                .removeIf(s -> s.getSkillName().equalsIgnoreCase(skill));
        profileRepository.save(profile);
    }

    @Override
    public void addDesiredSkill(String userId, String skill) {
        Profile profile = getProfile(userId);
        if (!profile.getSkillsToLearn().contains(skill)) {
            profile.getSkillsToLearn().add(skill);
            profileRepository.save(profile);
        }
    }

    @Override
    public void removeDesiredSkill(String userId, String skill) {
        Profile profile = getProfile(userId);
        profile.getSkillsToLearn().remove(skill);
        profileRepository.save(profile);
    }

    // ---------------- Ratings ----------------

    @Override
    public double getUserRating(String userId) {
        List<Double> ratings = findUserById(userId).getRatings();
        return ratings.isEmpty() ? 0.0 :
                ratings.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    @Override
    public void addUserRating(String userId, double rating) {
        User user = findUserById(userId);
        user.getRatings().add(rating);
        userRepository.save(user);
    }

    // ---------------- Sessions ----------------

    @Override
    public List<String> getUserSessionIds(String userId) {
        return new ArrayList<>(findUserById(userId).getSessionIds());
    }

    @Override
    public void addUserSession(String userId, String sessionId) {
        User user = findUserById(userId);
        if (!user.getSessionIds().contains(sessionId)) {
            user.getSessionIds().add(sessionId);
            userRepository.save(user);
        }
    }

    @Override
    public void removeUserSession(String userId, String sessionId) {
        User user = findUserById(userId);
        if (user.getSessionIds().remove(sessionId)) {
            userRepository.save(user);
        }
    }

    // ---------------- Notifications ----------------

    @Override
    public List<String> getNotifications(String userId) {
        return new ArrayList<>(findUserById(userId).getNotifications());
    }

    @Override
    public void clearNotifications(String userId) {
        User user = findUserById(userId);
        user.getNotifications().clear();
        userRepository.save(user);
    }

    // ---------------- Skill Demand Report (FIXED) ----------------

    @Override
    public List<SkillDemandDTO> getSkillDemandReport() {

        List<Profile> profiles = profileRepository.findAll();
        Map<String, Long> demandMap = new HashMap<>();

        for (Profile profile : profiles) {
            for (String skill : profile.getSkillsToLearn()) {
                demandMap.put(skill, demandMap.getOrDefault(skill, 0L) + 1);
            }
        }

        return demandMap.entrySet()
                .stream()
                .map(e -> new SkillDemandDTO(e.getKey(), e.getValue()))
                .sorted((a, b) -> Long.compare(b.getDemandCount(), a.getDemandCount()))
                .toList();
    }

    // ---------------- Helpers ----------------

    private User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with ID: " + userId));
    }

    private Profile getProfile(String userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("Profile not found for user: " + userId));
    }
}
