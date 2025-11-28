package com.university.skilllink.service;

import com.university.skilllink.dto.auth.UserDTO;
import java.util.List;

public interface UserService {

    // User retrieval
    UserDTO getUserById(String userId);
    UserDTO getUserByEmail(String email);
    List<UserDTO> getAllUsers();
    
    // Profile management
    void updateProfileCompletionStatus(String userId, boolean isCompleted);
    boolean isProfileCompleted(String userId);

    // Activation / deactivation
    void deactivateUser(String userId);
    void activateUser(String userId);

    // Skills management
    List<String> getUserOfferedSkills(String userId);
    List<String> getUserDesiredSkills(String userId);
    void addOfferedSkill(String userId, String skill);
    void removeOfferedSkill(String userId, String skill);
    void addDesiredSkill(String userId, String skill);
    void removeDesiredSkill(String userId, String skill);

    // Ratings & reviews
    double getUserRating(String userId);
    void addUserRating(String userId, double rating);

    // Session-related
    List<String> getUserSessionIds(String userId);
    void addUserSession(String userId, String sessionId);
    void removeUserSession(String userId, String sessionId);

    // Notifications
    void addNotification(String userId, String notification);
    List<String> getNotifications(String userId);
    void clearNotifications(String userId);

    // Get all active user IDs
    List<String> getAllActiveUserIds();
}
