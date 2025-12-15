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
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "profiles")
public class Profile {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId; // References User._id

    private String profilePicture; // URL or base64

    private String department;

    private Integer yearOfStudy;

    private String bio;

    private String phoneNumber;

    @Builder.Default
    private List<SkillToTeach> skillsToTeach = new ArrayList<>();

    @Builder.Default
    private List<String> skillsToLearn = new ArrayList<>();

    @Builder.Default
    private ProfileStatistics statistics = new ProfileStatistics();

    private SocialLinks socialLinks;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Nested class for skills to teach
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillToTeach {
        private String skillName;
        private SkillProficiency proficiency;
        private Integer yearsOfExperience;
    }

    // Enum for proficiency levels
    public enum SkillProficiency {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }

    // Nested class for statistics
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProfileStatistics {
        @Builder.Default
        private Integer totalStudentsTaught = 0;

        @Builder.Default
        private Integer totalSessionsCompleted = 0;

        @Builder.Default
        private Double averageRating = 0.0;

        @Builder.Default
        private Integer totalReviewsReceived = 0;
    }

    // Nested class for social links
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SocialLinks {
        private String linkedin;
        private String github;
        private String portfolio;
    }
}
