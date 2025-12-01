package com.university.skilllink.dto.auth;

import lombok.Data;

@Data
public class RequestDTO {
    private String providerId;
    private String skillName;
    private String note;
    // optional: allow seekerId only for local/manual testing (not used in production controllers)
    private String seekerId;}