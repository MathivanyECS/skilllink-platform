package com.university.skilllink.service.impl;

import com.university.skilllink.dto.auth.UserDTO;
import com.university.skilllink.exception.CustomExceptions.UserNotFoundException;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDTO getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
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

    @Override
    public void updateProfileCompletionStatus(String userId, boolean isCompleted) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        user.setIsProfileCompleted(isCompleted);
        userRepository.save(user);
    }

    @Override
    public boolean isProfileCompleted(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        return user.getIsProfileCompleted();
    }

    @Override
    public void deactivateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    public void activateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        user.setIsActive(true);
        userRepository.save(user);
    }

    // NEW: Get all active user IDs for notifications
    @Override
    public List<String> getAllActiveUserIds() {
        return userRepository.findAll().stream()
                .filter(User::getIsActive) // Only users who are active
                .map(User::getId)
                .collect(Collectors.toList());
    }
}
