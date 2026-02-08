package com.university.skilllink.service;

import com.university.skilllink.config.JwtConfig;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtConfig jwtConfig;

    public JwtService(
            @Qualifier("jwtConfig") JwtConfig jwtConfig
    ) {
        this.jwtConfig = jwtConfig;
    }

    public String getSecret() {
        return jwtConfig.getSecret();
    }

    public long getExpiration() {
        return jwtConfig.getExpiration();
    }
}
