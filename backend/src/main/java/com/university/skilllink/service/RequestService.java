package com.university.skilllink.service;

import com.university.skilllink.model.SkillRequest;

import java.util.List;
import java.util.Optional;

public interface RequestService {
    SkillRequest sendRequest(String seekerId, String providerId, String skillName, String note);
    List<SkillRequest> getIncomingRequests(String providerId);
    List<SkillRequest> getSentRequests(String seekerId);
    SkillRequest updateStatus(String requestId, String actorId, String status);

    // Add this method so implementations must provide it
    Optional<SkillRequest> getById(String requestId);
}
