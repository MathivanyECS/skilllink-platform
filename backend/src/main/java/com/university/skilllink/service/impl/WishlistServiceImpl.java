package com.university.skilllink.service.impl;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.NotificationType;
import com.university.skilllink.model.SkillWishlist;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.SkillWishlistRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final SkillWishlistRepository wishlistRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

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
            if (requesters == null)
                requesters = new HashSet<>();

            if (!requesters.contains(requesterUserId)) {
                requesters.add(requesterUserId);
                wishlist.setRequestedBy(requesters);
                wishlist.setRequestCount(requesters.size());
                wishlist = wishlistRepository.save(wishlist);
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

        // ✅ NOTIFY ALL USERS EXCEPT THE REQUESTER
        List<User> users = userRepository.findAll();

        for (User user : users) {

            // ❌ DO NOT notify the same user
            if (user.getId().equals(requesterUserId)) {
                continue;
            }

            Map<String, String> meta = new HashMap<>();
            meta.put("skillName", wishlist.getSkillName());
            meta.put("requesterId", requesterUserId);

            String title = "Wishlist Added";
            String message = isNew
                    ? "Someone added a wishlist for " + wishlist.getSkillName()
                    : "More users are interested in " + wishlist.getSkillName();

            Notification notification = Notification.builder()
                    .userId(user.getId())
                    .type(NotificationType.WISHLIST_CREATED)
                    .title(title)
                    .message(message)
                    .metadata(meta)
                    .createdAt(LocalDateTime.now())
                    .read(false)
                    .build();

            notificationService.createNotification(notification);
        }
    }

    @Override
    public void notifyWhenProviderAdded(String skillName, String providerId) {

        Optional<SkillWishlist> opt = wishlistRepository.findBySkillNameIgnoreCase(skillName);
        if (!opt.isPresent())
            return;

        SkillWishlist wishlist = opt.get();
        Set<String> requesters = wishlist.getRequestedBy();
        if (requesters == null || requesters.isEmpty())
            return;

        Map<String, String> meta = new HashMap<>();
        meta.put("skillName", skillName);
        meta.put("providerId", providerId);

        String title = "Wishlist match found";
        String message = "A provider just added " + skillName + ".";

        for (String userId : requesters) {
            notificationService.sendToUser(
                    userId,
                    NotificationType.WISHLIST_AVAILABLE,
                    title,
                    message,
                    meta);
        }
    }
}
