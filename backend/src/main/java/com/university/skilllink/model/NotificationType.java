package com.university.skilllink.model;

/**
 * Notification type constants used across the application.
 * Add new types here as required.
 */
public enum NotificationType {
    REQUEST,             // someone sent a skill request
    REQUEST_ACCEPTED,    // provider accepted a request
    REQUEST_REJECTED,    // provider rejected a request
    WISHLIST_CREATED,    // someone created/added a skill to wishlist
    WISHLIST_AVAILABLE,  // a provider added a skill that was on wishlist
    SESSION_UPDATE,      // session board updates (optional)
    POST_APPLICATION,    // collaboration post application (optional)
    GENERIC              // fallback generic notification
, ACCEPTED
}
