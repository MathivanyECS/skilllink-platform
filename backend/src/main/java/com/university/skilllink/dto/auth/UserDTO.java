package com.university.skilllink.dto.auth;

import com.university.skilllink.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String id;
    private String email;
    private String fullName;
    private String studentId;
    private String role;
    private Boolean isProfileCompleted;
    private Boolean isActive;
    private LocalDateTime createdAt;

    // Convert User entity to UserDTO
    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .studentId(user.getStudentId())
                .role(user.getRole().name())
                .isProfileCompleted(user.getIsProfileCompleted())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
