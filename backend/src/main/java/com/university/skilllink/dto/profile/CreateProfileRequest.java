package com.university.skilllink.dto.profile;

import com.university.skilllink.model.Profile;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProfileRequest {

    @NotBlank(message = "Department is required")
    private String department;

    @Min(value = 1, message = "Year of study must be at least 1")
    @Max(value = 6, message = "Year of study cannot exceed 6")
    private Integer yearOfStudy;

    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;

    private String phoneNumber;

    private String profilePicture;

    private List<SkillToTeachDTO> skillsToTeach = new ArrayList<>();

    private List<String> skillsToLearn = new ArrayList<>();

    private SocialLinksDTO socialLinks;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillToTeachDTO {
        @NotBlank(message = "Skill name is required")
        private String skillName;

        private Profile.SkillProficiency proficiency;

        @Min(value = 0, message = "Years of experience cannot be negative")
        private Integer yearsOfExperience;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialLinksDTO {
        private String linkedin;
        private String github;
        private String portfolio;
    }
}
