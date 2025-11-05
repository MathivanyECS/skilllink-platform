package com.university.skilllink.repository;
import com.university.skilllink.model.SkillRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RequestRepository extends MongoRepository<SkillRequest, String> {
    List<SkillRequest> findByRequesterId(String requesterId);
    List<SkillRequest> findByProviderId(String providerId);
}
