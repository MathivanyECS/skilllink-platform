package com.university.skilllink.repository;

import com.university.skilllink.model.SkillWishlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface SkillWishlistRepository extends MongoRepository<SkillWishlist, String> {
    Optional<SkillWishlist> findBySkillNameIgnoreCase(String skillName);
    List<SkillWishlist> findAllByOrderByRequestCountDesc();
}
