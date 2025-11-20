package com.university.skilllink.service.impl;

import com.university.skilllink.model.SkillWishlist;
import com.university.skilllink.repository.SkillWishlistRepository;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final SkillWishlistRepository wishlistRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void addWishlist(String requesterUserId, String skillName) {
        String normalized = skillName.trim();
        Optional<SkillWishlist> opt = wishlistRepository.findBySkillNameIgnoreCase(normalized);

        SkillWishlist wishlist;
        boolean isNew = false;
        if (opt.isPresent()) {
            wishlist = opt.get();
            Set<String> requesters = wishlist.getRequestedBy();
            if (requesters == null) requesters = new HashSet<>();
            if (!requesters.contains(requesterUserId)) {
                requesters.add(requesterUserId);
                wishlist.setRequestedBy(requesters);
                wishlist.setRequestCount(requesters.size());
                wishlist = wishlistRepository.save(wishlist);
            } else {
                // already requested by this user — ignore duplicate
            }
        } else {
            wishlist = SkillWishlist.builder()
                    .skillName(normalized)
                    .requestedBy(new HashSet<>(Collections.singletonList(requesterUserId)))
                    .requestCount(1)
                    .build();
            wishlist = wishlistRepository.save(wishlist);
            isNew = true;
        }

        // Notify users about a new wanted skill (skill wishlist)
        // send a general notification to everyone that a wishlist was created (type: WISHLIST_CREATED)
        Map<String, String> meta = new HashMap<>();
        meta.put("skillName", wishlist.getSkillName());
        meta.put("requesterId", requesterUserId);

        String title = "Skill wanted: " + wishlist.getSkillName();
        String message;
        if (isNew) {
            message = "Someone wants to learn " + wishlist.getSkillName() + ". If you can teach, please add it to your profile.";
        } else {
            message = "More people want to learn " + wishlist.getSkillName() + ".";
        }

        notificationService.sendToAllUsers("WISHLIST_CREATED", title, message, meta);
    }

    @Override
    public void notifyWhenProviderAdded(String skillName, String providerId) {
        Optional<SkillWishlist> opt = wishlistRepository.findBySkillNameIgnoreCase(skillName);
        if (!opt.isPresent()) return;

        SkillWishlist wishlist = opt.get();
        Set<String> requesters = wishlist.getRequestedBy();
        if (requesters == null || requesters.isEmpty()) return;

        Map<String,String> meta = new HashMap<>();
        meta.put("skillName", skillName);
        meta.put("providerId", providerId);

        String title = "Skill available: " + skillName;
        String message = "A provider just added " + skillName + " — you requested this skill. Please contact the provider or send a request.";

        // Notify each requester individually
        for (String userId : requesters) {
            notificationService.sendToUser(userId, "WISHLIST_AVAILABLE", title, message, meta);
        }

        // Optionally: remove the wishlist or keep it (we keep it so others still see demand).
    }
}
