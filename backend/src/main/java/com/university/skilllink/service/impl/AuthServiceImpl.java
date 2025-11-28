package com.university.skilllink.service.impl;

import com.university.skilllink.dto.auth.*;
import com.university.skilllink.exception.CustomExceptions.*;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.security.JwtUtil;
import com.university.skilllink.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        // Check if student ID already exists
        if (userRepository.existsByStudentId(request.getStudentId())) {
            throw new StudentIdAlreadyExistsException("Student ID already registered: " + request.getStudentId());
        }

        // Create new user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .studentId(request.getStudentId())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(
                        request.getRole() != null ?
                                User.UserRole.valueOf(request.getRole().toUpperCase()) :
                                User.UserRole.STUDENT
                )
                .isProfileCompleted(false)
                .isActive(true)
                .build();

        // Save user
        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(savedUser.getEmail())
                        .password(savedUser.getPassword())
                        .authorities("ROLE_" + savedUser.getRole().name())
                        .build()
        );

        // Return response
        return new AuthResponse(token, UserDTO.fromUser(savedUser));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword())
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Check if user is active
        if (!user.getIsActive()) {
            throw new AccountDeactivatedException("Your account has been deactivated. Please contact support.");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .authorities("ROLE_" + user.getRole().name())
                        .build()
        );

        // Return response
        return new AuthResponse(token, UserDTO.fromUser(user));
    }

    @Override
    public UserDTO verifyToken(String token) {
        try {
            String email = jwtUtil.extractUsername(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));
            return UserDTO.fromUser(user);
        } catch (Exception e) {
            throw new InvalidTokenException("Invalid or expired token");
        }
    }

    @Override
    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return UserDTO.fromUser(user);
    }

    @Override
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordExpiry(LocalDateTime.now().plusHours(24)); // Token valid for 24 hours

        userRepository.save(user);
        return resetToken;
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired reset token"));

        // Check if token is expired
        if (user.getResetPasswordExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Reset token has expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        userRepository.save(user);
    }
}
