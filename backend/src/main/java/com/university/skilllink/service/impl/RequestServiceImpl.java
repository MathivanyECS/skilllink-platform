package com.university.skilllink.service.impl;

import com.university.skilllink.exception.ForbiddenException;
import com.university.skilllink.exception.ResourceNotFoundException;
import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.SkillRequestRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RequestServiceImpl implements RequestService {

    private final SkillRequestRepository requestRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Override
    public SkillRequest sendRequest(String seekerId, String providerId, String skillName, String note) {
        SkillRequest req = SkillRequest.builder()
                .seekerId(seekerId)
                .providerId(providerId)
                .skillName(skillName)
                .note(note)
                .status(SkillRequest.RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        SkillRequest saved = requestRepository.save(req);

        String seekerName = userRepository.findById(seekerId).map(User::getFullName).orElse("Someone");
        String title = "New learning request";
        String message = String.format("%s requested to learn %s from you.", seekerName, skillName);

        Map<String, String> meta = new HashMap<>();
        meta.put("requestId", saved.getId());
        meta.put("url", "/requests/" + saved.getId());
        meta.put("skillName", skillName);
        meta.put("seekerId", seekerId);

        notificationService.sendToUser(providerId, "NEW_REQUEST", title, message, meta);

        return saved;
    }

    @Override
    public List<SkillRequest> getIncomingRequests(String providerId) {
        return requestRepository.findByProviderId(providerId);
    }

    @Override
    public List<SkillRequest> getSentRequests(String seekerId) {
        return requestRepository.findBySeekerId(seekerId);
    }

    @Override
    public SkillRequest updateStatus(String requestId, String actorId, String newStatus) {
        SkillRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillRequest not found"));

        SkillRequest.RequestStatus status;
        try {
            status = SkillRequest.RequestStatus.valueOf(newStatus);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }

        if ((status == SkillRequest.RequestStatus.ACCEPTED || status == SkillRequest.RequestStatus.REJECTED)
                && !req.getProviderId().equals(actorId)) {
            throw new ForbiddenException("Only the provider can accept or reject the request");
        }

        if (status == SkillRequest.RequestStatus.COMPLETED &&
                !(req.getProviderId().equals(actorId) || req.getSeekerId().equals(actorId))) {
            throw new ForbiddenException("Only participants can complete the session");
        }

        if (req.getStatus() == status) return req;

        req.setStatus(status);
        req.setUpdatedAt(LocalDateTime.now());
        SkillRequest saved = requestRepository.save(req);

        String actorName = userRepository.findById(actorId).map(User::getFullName).orElse("Someone");

        switch (status) {
            case ACCEPTED -> {
                String title = "Request accepted";
                String message = String.format("%s accepted your request to learn %s.", actorName, req.getSkillName());
                Map<String, String> meta = new HashMap<>();
                meta.put("requestId", saved.getId());
                meta.put("url", "/sessions/" + saved.getId());
                meta.put("providerId", req.getProviderId());
                meta.put("skillName", req.getSkillName());

                notificationService.sendToUser(req.getSeekerId(), "ACCEPTED", title, message, meta);
            }
            case REJECTED -> {
                String title = "Request rejected";
                String message = String.format("%s rejected your request to learn %s.", actorName, req.getSkillName());
                Map<String, String> meta = new HashMap<>();
                meta.put("requestId", saved.getId());
                meta.put("skillName", req.getSkillName());
                meta.put("providerId", req.getProviderId());

                notificationService.sendToUser(req.getSeekerId(), "REJECTED", title, message, meta);
            }
            case COMPLETED -> {
                String title = "Session completed";
                String message = String.format("Session for %s was marked completed by %s.", req.getSkillName(), actorName);
                Map<String, String> meta = new HashMap<>();
                meta.put("requestId", saved.getId());
                meta.put("url", "/sessions/" + saved.getId());
                meta.put("skillName", req.getSkillName());

                notificationService.sendToUser(req.getSeekerId(), "COLLAB", title, message, meta);
                notificationService.sendToUser(req.getProviderId(), "COLLAB", title, message, meta);
            }
            default -> {
                String title = "Request updated";
                String message = String.format("Request for %s updated to %s.", req.getSkillName(), status);
                Map<String, String> meta = new HashMap<>();
                meta.put("requestId", saved.getId());
                meta.put("skillName", req.getSkillName());

                notificationService.sendToUser(req.getSeekerId(), "NEW_REQUEST", title, message, meta);
            }
        }

        return saved;
    }

    @Override
    public SkillRequest getById(String requestId) {
        return requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillRequest not found"));
    }
}