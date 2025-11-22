package com.university.skilllink;

import org.springframework.data.mongodb.config.EnableMongoAuditing;

import com.university.skilllink.config.JwtConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableMongoAuditing
@EnableConfigurationProperties(JwtConfig.class)

public class SkilllinkApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkilllinkApplication.class, args);
    }
}

