package com.university.skilllink.service;

import com.university.skilllink.model.SkillWishlist;

import java.util.List;

public interface WishlistService {
    SkillWishlist addToWishlist(String userId, String skillName);
    List<SkillWishlist> getAll();
    List<SkillWishlist> getTop();
    void notifyWhenProviderAdded(String skillName, String providerUserId);
}
