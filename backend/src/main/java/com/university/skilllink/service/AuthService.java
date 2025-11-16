package com.university.skilllink.service;

import com.university.skilllink.dto.auth.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDTO verifyToken(String token);
    UserDTO getCurrentUser(String email);
    String forgotPassword(String email);
    void resetPassword(String token, String newPassword);
}
