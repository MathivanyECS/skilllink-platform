package com.university.skilllink.service;

import com.university.skilllink.model.User;
import com.university.skilllink.model.SkillWishlist;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.repository.SkillWishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SkillWishlistRepository wishlistRepository;

    /**
     * Get platform-wide stats for the Admin Dashboard
     * Example stats: total users, total providers, total seekers, trending skills
     */
    public Map<String, Object> getPlatformStats() {
        Map<String, Object> stats = new HashMap<>();

        List<User> users = userRepository.findAll();

        long totalUsers = users.size();
        long totalProviders = users.stream()
                .filter(user -> user.getOfferedSkills() != null && !user.getOfferedSkills().isEmpty())
                .count();
        long totalSeekers = users.stream()
                .filter(user -> user.getDesiredSkills() != null && !user.getDesiredSkills().isEmpty())
                .count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalSkillProviders", totalProviders);
        stats.put("totalSkillSeekers", totalSeekers);
        stats.put("trendingSkills", getTrendingSkills());

        return stats;
    }

    /**
     * Calculate trending skills based on wishlist demand
     */
    private Map<String, Integer> getTrendingSkills() {
        List<SkillWishlist> wishlists = wishlistRepository.findAll();
        Map<String, Integer> skillCount = new HashMap<>();

        for (SkillWishlist wishlist : wishlists) {
            skillCount.put(wishlist.getSkillName(), wishlist.getRequestCount());
        }

        // Sort descending by count
        return skillCount.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    /**
     * Fetch all users (for admin dashboard monitoring)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Delete a user by ID
     */
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
}
