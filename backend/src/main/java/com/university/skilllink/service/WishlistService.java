package com.university.skilllink.service;

public interface WishlistService {
    /**
     * Add a skill to wishlist for the given user. If skill exists, add requester to the set.
     * Also notify all users that a skill has been requested (WISHLIST_CREATED).
     */
    void addWishlist(String requesterUserId, String skillName);

    /**
     * When a provider adds a skill, notify all users who requested that skill with WISHLIST_AVAILABLE
     */
    void notifyWhenProviderAdded(String skillName, String providerId);
}
