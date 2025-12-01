package com.university.skilllink.service;

import com.university.skilllink.dto.profile.CreateProfileRequest;
import com.university.skilllink.dto.profile.ProfileDTO;

import java.util.List;

/**
 * Service interface for Profile management operations
 */
public interface ProfileService {

    /**
     * Create a new profile for a user
     *
     * @param userId User ID to create profile for
     * @param request Profile creation request data
     * @return Created profile DTO
     */
    ProfileDTO createProfile(String userId, CreateProfileRequest request);

    /**
     * Get profile by user ID
     *
     * @param userId User ID to fetch profile for
     * @return Profile DTO
     */
    ProfileDTO getProfileByUserId(String userId);

    /**
     * Get all profiles (for dashboard)
     *
     * @return List of all profile DTOs
     */
    List<ProfileDTO> getAllProfiles();

    /**
     * Get profiles filtered by department
     *
     * @param department Department name to filter by
     * @return List of profile DTOs in that department
     */
    List<ProfileDTO> getProfilesByDepartment(String department);

    /**
     * Get profiles filtered by skill they teach
     *
     * @param skillName Skill name to filter by
     * @return List of profile DTOs that teach this skill
     */
    List<ProfileDTO> getProfilesBySkill(String skillName);

    /**
     * Get profiles filtered by department and year of study
     *
     * @param department Department name
     * @param yearOfStudy Year of study
     * @return List of profile DTOs matching criteria
     */
    List<ProfileDTO> getProfilesByDepartmentAndYear(String department, Integer yearOfStudy);

    List<ProfileDTO> getProfilesByYear(Integer year);
    List<ProfileDTO> getProfilesBySkillPrefix(String prefix);

    /**
     * Update existing profile
     *
     * @param userId User ID whose profile to update
     * @param request Updated profile data
     * @return Updated profile DTO
     */
    ProfileDTO updateProfile(String userId, CreateProfileRequest request);

    /**
     * Delete profile by user ID
     *
     * @param userId User ID whose profile to delete
     */
    void deleteProfile(String userId);

    /**
     * Check if profile exists for user
     *
     * @param userId User ID to check
     * @return true if profile exists, false otherwise
     */
    boolean profileExists(String userId);
}
