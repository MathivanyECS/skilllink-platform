package com.university.skilllink.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "profiles")
public class Profile {

    @Id
    private String id;
    private String name;
    private String role; // e.g., "Teacher" or "Learner"
    private String courseName;
    private String email;
    private String status; // e.g., "Pending", "Accepted", "Rejected"

    public Profile() {}

    public Profile(String id, String name, String role, String courseName, String email, String status) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.courseName = courseName;
        this.email = email;
        this.status = status;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
