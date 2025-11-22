package com.university.skilllink.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "skill_wishlist")
public class SkillWishlist {
    @Id private String id;
    private String skillName;
    private Set<String> requestedBy; // userIds who want it
    private int requestCount;
    @CreatedDate private LocalDateTime createdAt;
}
