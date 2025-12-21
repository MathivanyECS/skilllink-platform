package com.university.skilllink.repository;

import com.university.skilllink.model.Profile;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {

    // -----------------------------
    // BASIC PROFILE QUERIES
    // -----------------------------

    Optional<Profile> findByUserId(String userId);

    Boolean existsByUserId(String userId);

    // Find profiles by department (regex)
    List<Profile> findByDepartmentRegex(String regex);

    // Find profiles by year of study
    List<Profile> findByYearOfStudy(Integer yearOfStudy);

    // Find profiles that teach a specific skill (exact match)
    List<Profile> findBySkillsToTeachSkillName(String skillName);

    // Find profiles that teach a skill (case-insensitive)
    @Query("{ 'skillsToTeach.skillName': { $regex: ?0, $options: 'i' } }")
    List<Profile> findBySkillsToTeachSkillNameRegex(String regex);

    // Find profiles by department and year
    List<Profile> findByDepartmentAndYearOfStudy(String department, Integer year);

    // -----------------------------
    // ADMIN ANALYTICS — TOP SKILL PROVIDERS
    // -----------------------------

    @Aggregation(pipeline = {
        "{ $unwind: '$skillsToLearn' }",
        "{ $group: { _id: '$skillsToLearn', demandCount: { $sum: 1 } } }",
        "{ $lookup: { from: 'profiles', localField: '_id', foreignField: 'skillsToTeach.skillName', as: 'providers' } }",
        "{ $unwind: '$providers' }",
        "{ $project: { skillName: '$_id', demandCount: 1, providerUserId: '$providers.userId' } }"
    })
    List<SkillDemandAggregation> aggregateTopSkillProviders();

    interface SkillDemandAggregation {
        String getSkillName();
        long getDemandCount();
        String getProviderUserId();
    }

    @Aggregation(pipeline = {
    "{ $unwind: '$skillsToLearn' }",
    "{ $group: { _id: '$skillsToLearn', demandCount: { $sum: 1 } } }",
    "{ $lookup: { from: 'profiles', localField: '_id', foreignField: 'skillsToTeach.skillName', as: 'providers' } }",
    "{ $project: { " +
        "skillName: '$_id', " +
        "demandCount: 1, " +
        "providerCount: { $size: '$providers' }, " +
        "gapScore: { $subtract: ['$demandCount', { $size: '$providers' }] } " +
    "} }",
    "{ $sort: { gapScore: -1 } }"
    })

    List<SkillGapAggregation> aggregateSkillGapReport();

    interface SkillGapAggregation {
    String getSkillName();
    long getDemandCount();
    long getProviderCount();
    long getGapScore();
    }
}
