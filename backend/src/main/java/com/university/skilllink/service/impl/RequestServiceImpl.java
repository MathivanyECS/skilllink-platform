package com.university.skilllink.service.impl;

import com.university.skilllink.exception.ForbiddenException;
import com.university.skilllink.exception.ResourceNotFoundException;
import com.university.skilllink.model.Notification;
import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.SkillRequestRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
        String content = String.format("%s requested to learn %s from you.", seekerName, skillName);
        notificationService.send(providerId, Notification.NotificationType.NEW_REQUEST, content, "/requests/" + saved.getId());

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
                String content = String.format("%s accepted your request to learn %s.", actorName, req.getSkillName());
                notificationService.send(req.getSeekerId(), Notification.NotificationType.ACCEPTED, content, "/sessions/" + saved.getId());
            }
            case REJECTED -> {
                String content = String.format("%s rejected your request to learn %s.", actorName, req.getSkillName());
                notificationService.send(req.getSeekerId(), Notification.NotificationType.REJECTED, content, null);
            }
            case COMPLETED -> {
                String content = String.format("Session for %s was marked completed by %s.", req.getSkillName(), actorName);
                notificationService.send(req.getSeekerId(), Notification.NotificationType.MESSAGE, content, "/sessions/" + saved.getId());
                notificationService.send(req.getProviderId(), Notification.NotificationType.MESSAGE, content, "/sessions/" + saved.getId());
            }
            default -> {
                String content = String.format("Request for %s updated to %s.", req.getSkillName(), status);
                notificationService.send(req.getSeekerId(), Notification.NotificationType.MESSAGE, content, null);
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
