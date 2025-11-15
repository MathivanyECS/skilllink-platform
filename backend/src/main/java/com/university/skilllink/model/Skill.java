package com.university.skilllink.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document("skills")
public class Skill {
    @Id private String id;
    private String name;
    private String description;
    private List<String> tags; // search keywords
    private String providerId; // user who offers it
    private double rating; // aggregate
    private boolean active = true;
    // getters/setters/constructors
}