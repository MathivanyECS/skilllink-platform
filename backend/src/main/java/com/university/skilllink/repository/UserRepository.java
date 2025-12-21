package com.university.skilllink.repository;

import com.university.skilllink.dto.admin.SkillDemandDTO;
import com.university.skilllink.model.User;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByStudentId(String studentId);

    Boolean existsByEmail(String email);

    Boolean existsByStudentId(String studentId);

    Optional<User> findByResetPasswordToken(String token);

    // Find users with expired reset tokens for cleanup
    void deleteByResetPasswordExpiryBefore(LocalDateTime dateTime);

    // --- Skill demand aggregation ---
    @Aggregation(pipeline = {
            "{ $unwind: '$profile.skillsToLearn' }",
            "{ $group: { _id: '$profile.skillsToLearn', demandCount: { $sum: 1 } } }",
            "{ $project: { skillName: '$_id', demandCount: 1, _id: 0 } }"
    })
    List<SkillDemandDTO> aggregateSkillWishlist();
}
