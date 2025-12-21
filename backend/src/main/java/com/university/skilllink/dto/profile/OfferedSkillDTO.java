package com.university.skilllink.dto.profile;

import com.university.skilllink.model.Profile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferedSkillDTO {
    private String skillName;
    private Profile.SkillProficiency proficiency;
    private Integer yearsOfExperience;

    public static OfferedSkillDTO fromSkill(Profile.SkillToTeach skill) {
        return new OfferedSkillDTO(skill.getSkillName(), skill.getProficiency(), skill.getYearsOfExperience());
    }
}
