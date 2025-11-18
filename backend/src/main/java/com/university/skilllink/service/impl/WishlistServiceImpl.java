package com.university.skilllink.service.impl;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.SkillWishlist;
import com.university.skilllink.repository.SkillWishlistRepository;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final SkillWishlistRepository wishlistRepository;
    private final NotificationService notificationService;

    @Override
    public SkillWishlist addToWishlist(String userId, String skillName) {
        Optional<SkillWishlist> opt = wishlistRepository.findBySkillNameIgnoreCase(skillName);
        SkillWishlist w;
        if (opt.isPresent()) {
            w = opt.get();
            Set<String> users = w.getRequestedBy() == null ? new HashSet<>() : new HashSet<>(w.getRequestedBy());
            if (!users.contains(userId)) {
                users.add(userId);
                w.setRequestedBy(users);
                w.setRequestCount(users.size());
                w = wishlistRepository.save(w);
            }
        } else {
            Set<String> users = new HashSet<>();
            users.add(userId);
            w = SkillWishlist.builder()
                    .skillName(skillName)
                    .requestedBy(users)
                    .requestCount(1)
                    .createdAt(LocalDateTime.now())
                    .build();
            w = wishlistRepository.save(w);
        }
        return w;
    }

    @Override
    public List<SkillWishlist> getAll() {
        return wishlistRepository.findAll();
    }

    @Override
    public List<SkillWishlist> getTop() {
        return wishlistRepository.findAllByOrderByRequestCountDesc();
    }

    /**
     * Called by ProfileServiceImpl after a provider adds a skill to their profile.
     * Notify all users who requested that skill.
     */
    @Override
    public void notifyWhenProviderAdded(String skillName, String providerUserId) {
        Optional<SkillWishlist> opt = wishlistRepository.findBySkillNameIgnoreCase(skillName);
        if (opt.isEmpty()) return;

        SkillWishlist w = opt.get();
        Set<String> users = w.getRequestedBy();
        if (users == null || users.isEmpty()) return;

        // notify each requester
        String content = String.format("A provider started offering %s. Check their profile.", skillName);
        for (String requesterId : users) {
            notificationService.send(requesterId, Notification.NotificationType.WISHLIST_AVAILABLE, content, "/profiles/" + providerUserId);
        }

        // Optionally: clear the wishlist entry or keep it (we'll keep it and leave requestCount intact)
    }
}
