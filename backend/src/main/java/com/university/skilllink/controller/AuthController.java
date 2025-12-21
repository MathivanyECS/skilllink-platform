package com.university.skilllink.controller;

import com.university.skilllink.dto.admin.SkillDemandDTO;
import com.university.skilllink.dto.auth.*;
import com.university.skilllink.service.AuthService;
import com.university.skilllink.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    // ---------------- AUTH ----------------

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/verify-token")
    public ResponseEntity<Map<String, Object>> verifyToken(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UserDTO user = authService.verifyToken(token);

        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return ResponseEntity.ok(
                authService.getCurrentUser(authentication.getName())
        );
    }

    // ---------------- PASSWORD ----------------

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestParam String email
    ) {
        String resetToken = authService.forgotPassword(email);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset token generated");
        response.put("token", resetToken); // remove in production

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        authService.resetPassword(token, newPassword);

        return ResponseEntity.ok(
                Map.of("message", "Password reset successfully")
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }

    // ---------------- REPORTS ----------------

    @GetMapping("/reports/skill-demand")
    public ResponseEntity<List<SkillDemandDTO>> getSkillDemandReport() {
        return ResponseEntity.ok(userService.getSkillDemandReport());
    }
}
