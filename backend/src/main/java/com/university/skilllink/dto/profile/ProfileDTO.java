package com.university.skilllink.dto.profile;

import com.university.skilllink.model.Profile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {

    private String id;
    private String userId;
    private String fullName; // From User
    private String email; // From User
    private String profilePicture;
    private String department;
    private Integer yearOfStudy;
    private String bio;
    private String phoneNumber;
    private List<SkillToTeachDTO> skillsToTeach;
    private List<String> skillsToLearn;
    private ProfileStatisticsDTO statistics;
    private SocialLinksDTO socialLinks;
    private LocalDateTime createdAt;

    // Nested DTOs
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillToTeachDTO {
        private String skillName;
        private String proficiency;
        private Integer yearsOfExperience;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileStatisticsDTO {
        private Integer totalStudentsTaught;
        private Integer totalSessionsCompleted;
        private Double averageRating;
        private Integer totalReviewsReceived;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialLinksDTO {
        private String linkedin;
        private String github;
        private String portfolio;
    }

    // Convert Profile to ProfileDTO
    public static ProfileDTO fromProfile(Profile profile, String fullName, String email) {
        return ProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .fullName(fullName)
                .email(email)
                .profilePicture(profile.getProfilePicture())
                .department(profile.getDepartment())
                .yearOfStudy(profile.getYearOfStudy())
                .bio(profile.getBio())
                .phoneNumber(profile.getPhoneNumber())
                .skillsToTeach(profile.getSkillsToTeach().stream()
                        .map(skill -> SkillToTeachDTO.builder()
                                .skillName(skill.getSkillName())
                                .proficiency(skill.getProficiency().name())
                                .yearsOfExperience(skill.getYearsOfExperience())
                                .build())
                        .collect(Collectors.toList()))
                .skillsToLearn(profile.getSkillsToLearn())
                .statistics(ProfileStatisticsDTO.builder()
                        .totalStudentsTaught(profile.getStatistics().getTotalStudentsTaught())
                        .totalSessionsCompleted(profile.getStatistics().getTotalSessionsCompleted())
                        .averageRating(profile.getStatistics().getAverageRating())
                        .totalReviewsReceived(profile.getStatistics().getTotalReviewsReceived())
                        .build())
                .socialLinks(profile.getSocialLinks() != null ? SocialLinksDTO.builder()
                        .linkedin(profile.getSocialLinks().getLinkedin())
                        .github(profile.getSocialLinks().getGithub())
                        .portfolio(profile.getSocialLinks().getPortfolio())
                        .build() : null)
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
