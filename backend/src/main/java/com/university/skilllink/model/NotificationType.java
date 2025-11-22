package com.university.skilllink.model;

public enum NotificationType {
    REQUEST,             // someone sent a skill request
    REQUEST_ACCEPTED,    // provider accepted a request
    REQUEST_REJECTED,    // provider rejected a request
    WISHLIST_CREATED,    // someone created/added a skill to wishlist
    WISHLIST_AVAILABLE,  // a provider added a skill that was on wishlist
    SESSION_UPDATE,
    POST_APPLICATION,
    GENERIC,
    COLLAB   

}
