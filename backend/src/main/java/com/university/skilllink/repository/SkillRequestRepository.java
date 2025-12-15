package com.university.skilllink.repository;

import com.university.skilllink.model.SkillRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SkillRequestRepository extends MongoRepository<SkillRequest, String> {
    List<SkillRequest> findByProviderIdOrderByCreatedAtDesc(String providerId);
    List<SkillRequest> findBySeekerIdOrderByCreatedAtDesc(String seekerId);
}
