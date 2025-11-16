package com.university.skilllink.controller;

import com.university.skilllink.dto.auth.*;
import com.university.skilllink.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // Verify JWT token
    @GetMapping("/verify-token")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        UserDTO user = authService.verifyToken(token);

        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    // Get current user
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        UserDTO user = authService.getCurrentUser(email);
        return ResponseEntity.ok(user);
    }

    // Forgot password
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam String email) {
        String resetToken = authService.forgotPassword(email);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset token generated");
        response.put("token", resetToken); // Remove this in production! Send via email instead

        return ResponseEntity.ok(response);
    }

    // Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        authService.resetPassword(token, newPassword);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successfully");

        return ResponseEntity.ok(response);
    }

    // Logout (client-side only - remove token from storage)
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}
