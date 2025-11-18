package com.university.skilllink.repository;

import com.university.skilllink.model.SkillRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRequestRepository extends MongoRepository<SkillRequest, String> {
    List<SkillRequest> findByProviderUserId(String providerUserId);
    List<SkillRequest> findByRequesterId(String requesterId);
}
