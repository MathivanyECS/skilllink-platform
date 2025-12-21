package com.university.skilllink.dto.profile;

import com.university.skilllink.model.Profile.SkillProficiency;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillToTeachDTO {
    private String skillName;
    private SkillProficiency proficiency;
    private Integer yearsOfExperience;
}
