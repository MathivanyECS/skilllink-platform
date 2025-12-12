package com.university.skilllink.repository;

import com.university.skilllink.model.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {

    Optional<Profile> findByUserId(String userId);

    Boolean existsByUserId(String userId);

    // Find profiles by department (for filtering)
    List<Profile> findByDepartmentRegex(String regex);

    // Find profiles by year of study (for filtering)
    List<Profile> findByYearOfStudy(Integer yearOfStudy);

    // Find profiles that teach specific skill (exact match)
    List<Profile> findBySkillsToTeachSkillName(String skillName);

    @Query("{ 'skillsToTeach.skillName': { $regex: ?0, $options: 'i' } }")
    List<Profile> findBySkillsToTeachSkillNameRegex(String regex);

    // Find profiles by department and year
    List<Profile> findByDepartmentAndYearOfStudy(String department, Integer year);
}
