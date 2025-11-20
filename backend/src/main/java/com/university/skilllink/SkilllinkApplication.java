package com.university.skilllink;

import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableMongoAuditing
public class SkilllinkApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkilllinkApplication.class, args);
    }
}

