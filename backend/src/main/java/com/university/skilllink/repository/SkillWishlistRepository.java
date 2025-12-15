package com.university.skilllink.repository;

import com.university.skilllink.model.SkillWishlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillWishlistRepository extends MongoRepository<SkillWishlist, String> {
    Optional<SkillWishlist> findBySkillNameIgnoreCase(String skillName);
}
