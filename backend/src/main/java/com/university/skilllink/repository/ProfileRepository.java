package com.university.skilllink.repository;

import com.university.skilllink.model.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {
    List<Profile> findByEmail(String email);
    List<Profile> findByRole(String role);
}
