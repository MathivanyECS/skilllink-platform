package com.university.skilllink.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillGapReportDTO {

    private String skillName;
    private long demandCount;
    private long providerCount;
    private long gapScore;
}
