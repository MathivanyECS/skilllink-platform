package com.university.skilllink.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.university.skilllink.repository")
@EnableMongoAuditing
public class MongoConfig {
    // MongoDB configuration is handled by application.properties
    // This class enables auditing features like @CreatedDate and @LastModifiedDate
}
