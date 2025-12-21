package com.university.skilllink.service;

import com.university.skilllink.config.JwtConfig;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtConfig jwtConfig;

    public JwtService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    public String getSecret() {
        return jwtConfig.getSecret();
    }

    public long getExpiration() {
        return jwtConfig.getExpiration();
    }
}