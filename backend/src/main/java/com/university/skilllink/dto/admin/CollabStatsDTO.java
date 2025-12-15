package com.university.skilllink.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CollabStatsDTO {
    private long totalPosts;
    private long totalApplicants;
    private long completedCollaborations;
}
