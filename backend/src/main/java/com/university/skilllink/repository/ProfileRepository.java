package com.university.skilllink.repository;

import com.university.skilllink.model.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {

    Optional<Profile> findByUserId(String userId);

    Boolean existsByUserId(String userId);

    // Find profiles by department (for filtering)
    List<Profile> findByDepartment(String department);

    // Find profiles by year of study (for filtering)
    List<Profile> findByYearOfStudy(Integer yearOfStudy);

    // Find profiles that teach specific skill
    List<Profile> findBySkillsToTeachSkillName(String skillName);

    // Find profiles by department and year
    List<Profile> findByDepartmentAndYearOfStudy(String department, Integer year);
}
