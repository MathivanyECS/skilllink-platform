package com.university.skilllink.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType;
    private UserDTO user;

    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.tokenType = "Bearer";
        this.user = user;
    }
}
