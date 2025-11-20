package com.university.skilllink.service;

import com.university.skilllink.model.SkillRequest;

import java.util.List;

public interface SkillRequestService {
    SkillRequest create(SkillRequest req);
    SkillRequest accept(String requestId);
    SkillRequest reject(String requestId);
    List<SkillRequest> findForProvider(String providerUserId);
}
