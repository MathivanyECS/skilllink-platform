package com.university.skilllink.service;
import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.repository.RequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RequestService {
    private final RequestRepository repo;

    public RequestService(RequestRepository repo) {
        this.repo = repo;
    }

    public SkillRequest createRequest(SkillRequest req) {
        req.setStatus("PENDING");
        req.setCreatedAt(LocalDateTime.now());
        req.setUpdatedAt(LocalDateTime.now());
        return repo.save(req);
    }

    public List<SkillRequest> getOutgoing(String requesterId) {
        return repo.findByRequesterId(requesterId);
    }

    public List<SkillRequest> getIncoming(String providerId) {
        return repo.findByProviderId(providerId);
    }

    public SkillRequest updateStatus(String id, String status) {
        Optional<SkillRequest> opt = repo.findById(id);
        if (opt.isPresent()) {
            SkillRequest req = opt.get();
            req.setStatus(status.toUpperCase());
            req.setUpdatedAt(LocalDateTime.now());
            return repo.save(req);
        }
        throw new RuntimeException("Request not found");
    }
}
