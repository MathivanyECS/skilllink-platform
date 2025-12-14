package com.university.skilllink.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SkillDemandDTO {
    private String skillName;
    private long demandCount; // number of users wishing this skill
}
