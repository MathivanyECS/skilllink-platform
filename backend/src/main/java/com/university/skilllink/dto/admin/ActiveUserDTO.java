package com.university.skilllink.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActiveUserDTO {
    private String id;
    private String fullName;
    private String email;
    private String role;
}
