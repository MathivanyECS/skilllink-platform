package com.university.skilllink.model;


public enum NotificationType {
    // kept broad set to cover existing DB values and new ones used by the backend
    CONNECT,              // collaboration post related
    NEW_REQUEST,              // someone sent a skill request
    REQUEST_ACCEPTED,     // provider accepted a request
    REQUEST_REJECTED,     // provider rejected a request
    WISHLIST_CREATED,     // someone created/added a skill to wishlist
    WISHLIST_AVAILABLE,   // a provider added a skill that was on wishlist
    SESSION_UPDATE,       // session / scheduling updates
    POST_APPLICATION,     // application to a post
    GENERIC,               // fallback type
    PROFILE_UPDATED
}
