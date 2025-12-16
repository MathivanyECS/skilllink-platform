package com.university.skilllink.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopSkillProviderDTO {

    private String userId;
    private String fullName;
    private String email;
    private String skillName;
    private long demandCount;
}
