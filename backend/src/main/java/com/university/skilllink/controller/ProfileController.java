package com.university.skilllink.controller;

import com.university.skilllink.model.Profile;
import com.university.skilllink.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public List<Profile> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    @GetMapping("/{id}")
    public Profile getProfileById(@PathVariable String id) {
        return profileService.getProfileById(id);
    }

    @PostMapping
    public Profile createProfile(@RequestBody Profile profile) {
        return profileService.saveProfile(profile);
    }

    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable String id) {
        profileService.deleteProfile(id);
    }

    // Extra endpoints
    @GetMapping("/email/{email}")
    public List<Profile> getProfilesByEmail(@PathVariable String email) {
        return profileService.getProfilesByEmail(email);
    }

    @GetMapping("/role/{role}")
    public List<Profile> getProfilesByRole(@PathVariable String role) {
        return profileService.getProfilesByRole(role);
    }
}
