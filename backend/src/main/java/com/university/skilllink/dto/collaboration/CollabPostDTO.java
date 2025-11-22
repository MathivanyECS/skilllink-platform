package com.university.skilllink.dto.collaboration;

import lombok.Data;

import java.util.List;

@Data
public class CollabPostDTO {
    private String title;
    private String description;
    private String category;
    private String duration;
    private List<String> requiredSkills;
}
