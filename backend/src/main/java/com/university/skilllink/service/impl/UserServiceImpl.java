package com.university.skilllink.service.impl;

import com.university.skilllink.dto.auth.UserDTO;
import com.university.skilllink.exception.CustomExceptions.UserNotFoundException;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // --- User retrieval ---
    @Override
    public UserDTO getUserById(String userId) {
        User user = findUserById(userId);
        return UserDTO.fromUser(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return UserDTO.fromUser(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toList());
    }

    // --- Profile management ---
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

    // --- Activation / Deactivation ---
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
        return userRepository.findAll().stream()
                .filter(User::getIsActive)
                .map(User::getId)
                .collect(Collectors.toList());
    }

    // --- Skills management ---
    @Override
    public List<String> getUserOfferedSkills(String userId) {
        return new ArrayList<>(findUserById(userId).getOfferedSkills());
    }

    @Override
    public List<String> getUserDesiredSkills(String userId) {
        return new ArrayList<>(findUserById(userId).getDesiredSkills());
    }

    @Override
    public void addOfferedSkill(String userId, String skill) {
        User user = findUserById(userId);
        if (!user.getOfferedSkills().contains(skill)) {
            user.getOfferedSkills().add(skill);
            userRepository.save(user);
        }
    }

    @Override
    public void removeOfferedSkill(String userId, String skill) {
        User user = findUserById(userId);
        if (user.getOfferedSkills().contains(skill)) {
            user.getOfferedSkills().remove(skill);
            userRepository.save(user);
        }
    }

    @Override
    public void addDesiredSkill(String userId, String skill) {
        User user = findUserById(userId);
        if (!user.getDesiredSkills().contains(skill)) {
            user.getDesiredSkills().add(skill);
            userRepository.save(user);
        }
    }

    @Override
    public void removeDesiredSkill(String userId, String skill) {
        User user = findUserById(userId);
        if (user.getDesiredSkills().contains(skill)) {
            user.getDesiredSkills().remove(skill);
            userRepository.save(user);
        }
    }

    // --- Ratings management ---
    @Override
    public double getUserRating(String userId) {
        User user = findUserById(userId);
        List<Double> ratings = user.getRatings();
        if (ratings.isEmpty()) return 0.0;
        return ratings.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    @Override
    public void addUserRating(String userId, double rating) {
        User user = findUserById(userId);
        user.getRatings().add(rating);
        userRepository.save(user);
    }

    // --- Session management ---
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
        if (user.getSessionIds().contains(sessionId)) {
            user.getSessionIds().remove(sessionId);
            userRepository.save(user);
        }
    }

    // --- Notifications ---
    @Override
    public void addNotification(String userId, String notification) {
        User user = findUserById(userId);
        user.getNotifications().add(notification);
        userRepository.save(user);
    }

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

    // --- Private helper ---
    private User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
    }
}
