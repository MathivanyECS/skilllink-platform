package com.university.skilllink.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password; // Hashed password

    private String fullName;

    @Indexed(unique = true)
    private String studentId;

    private UserRole role;

    @Builder.Default
    private Boolean isProfileCompleted = false;

    @Builder.Default
    private Boolean isActive = true;

    // Password reset fields
    private String resetPasswordToken;
    private LocalDateTime resetPasswordExpiry;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Enum for user roles
    public enum UserRole {
        STUDENT,
        ADMIN
    }
}
