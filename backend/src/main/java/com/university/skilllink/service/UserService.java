package com.university.skilllink.service;

import com.university.skilllink.dto.auth.UserDTO;
import java.util.List;

public interface UserService {
    UserDTO getUserById(String userId);
    UserDTO getUserByEmail(String email);
    List<UserDTO> getAllUsers();
    void updateProfileCompletionStatus(String userId, boolean isCompleted);
    boolean isProfileCompleted(String userId);
    void deactivateUser(String userId);
    void activateUser(String userId);

    // NEW: Get all active user IDs
    List<String> getAllActiveUserIds();
}
