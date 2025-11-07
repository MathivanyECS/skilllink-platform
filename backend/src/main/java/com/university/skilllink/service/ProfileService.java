package com.university.skilllink.service;

import com.university.skilllink.model.Profile;
import com.university.skilllink.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    // Fetch all profiles
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    // Get profile by ID (returns null if not found, no exception thrown)
    public Profile getProfileById(String id) {
        Optional<Profile> profile = profileRepository.findById(id);
        return profile.orElse(null); // ✅ no null-safety warnings
    }

    // Save or update profile
    public Profile saveProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    // Delete profile by ID
    public void deleteProfile(String id) {
        profileRepository.deleteById(id);
    }

    // Find profiles by email
    public List<Profile> getProfilesByEmail(String email) {
        return profileRepository.findByEmail(email);
    }

    // Find profiles by role
    public List<Profile> getProfilesByRole(String role) {
        return profileRepository.findByRole(role);
    }
}
