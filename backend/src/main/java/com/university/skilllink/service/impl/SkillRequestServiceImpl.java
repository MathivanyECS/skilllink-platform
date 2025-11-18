package com.university.skilllink.service.impl;

import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.repository.SkillRequestRepository;
import com.university.skilllink.service.SkillRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillRequestServiceImpl implements SkillRequestService {

    private final SkillRequestRepository reqRepo;

    @Override
    public SkillRequest create(SkillRequest req) {
        req.setStatus(SkillRequest.Status.PENDING);
        req.setCreatedAt(Instant.now());
        return reqRepo.save(req);
    }

    @Override
    public SkillRequest accept(String requestId) {
        SkillRequest r = reqRepo.findById(requestId).orElseThrow();
        r.setStatus(SkillRequest.Status.ACCEPTED);
        return reqRepo.save(r);
    }

    @Override
    public SkillRequest reject(String requestId) {
        SkillRequest r = reqRepo.findById(requestId).orElseThrow();
        r.setStatus(SkillRequest.Status.REJECTED);
        return reqRepo.save(r);
    }

    @Override
    public List<SkillRequest> findForProvider(String providerUserId) {
        return reqRepo.findByProviderUserId(providerUserId);
    }
}
