package com.university.skilllink.service.impl;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.NotificationType;
import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.SkillRequestRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Fixed: handles Optional<User> for all UserRepository lookup methods.
 */
@Service
@RequiredArgsConstructor
public class SkillRequestServiceImpl implements RequestService {

    private final SkillRequestRepository skillRequestRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Override
    public SkillRequest sendRequest(String seekerId, String providerIdentifier, String skillName, String note) {
        String providerId = resolveProviderId(providerIdentifier);
        if (providerId == null) {
            throw new RuntimeException("Provider not found for identifier: " + providerIdentifier);
        }

        SkillRequest req = SkillRequest.builder()
                .seekerId(seekerId)
                .providerId(providerId)
                .skillName(skillName)
                .note(note)
                .status(SkillRequest.RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        SkillRequest saved = skillRequestRepository.save(req);

        Map<String, String> meta = new HashMap<>();
        meta.put("requestId", saved.getId());
        meta.put("seekerId", seekerId);
        meta.put("skillName", skillName);

        Notification notification = Notification.builder()
                .userId(providerId)
                .type(NotificationType.REQUEST)
                .title("New skill request")
                .message("You received a new request for '" + skillName + "'")
                .metadata(meta)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();

        notificationService.createNotification(notification);
        return saved;
    }

    @Override
    public List<SkillRequest> getIncomingRequests(String providerId) {
        if (providerId == null) return Collections.emptyList();
        return skillRequestRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
    }

    @Override
    public List<SkillRequest> getSentRequests(String seekerId) {
        if (seekerId == null) return Collections.emptyList();
        return skillRequestRepository.findBySeekerIdOrderByCreatedAtDesc(seekerId);
    }

    @Override
    public SkillRequest updateStatus(String requestId, String actorId, String status) {
        // load request (throws if not found)
        SkillRequest req = skillRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        // ---- load actor as Optional and handle safely ----
        Optional<User> actorOpt = userRepository.findById(actorId);
        if (actorOpt.isEmpty()) {
            throw new RuntimeException("Actor user not found: " + actorId);
        }
        User actor = actorOpt.get();

        String actorStudentId = actor.getStudentId();
        String actorEmail = actor.getEmail();

        // allow provider to be identified by canonical id, studentId, or email
        boolean okById = actorId != null && actorId.equals(req.getProviderId());
        boolean okByStudent = actorStudentId != null && actorStudentId.equals(req.getProviderId());
        boolean okByEmail = actorEmail != null && actorEmail.equals(req.getProviderId());

        if (!(okById || okByStudent || okByEmail)) {
            throw new RuntimeException("Only the provider can change request status.");
        }

        // validate status enum
        SkillRequest.RequestStatus newStatus;
        try {
            newStatus = SkillRequest.RequestStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid status: " + status);
        }

        // update request
        req.setStatus(newStatus);
        req.setUpdatedAt(LocalDateTime.now());
        SkillRequest updated = skillRequestRepository.save(req);

        // create notification for seeker
        Map<String, String> meta = new HashMap<>();
        meta.put("requestId", req.getId());
        meta.put("providerId", req.getProviderId());
        meta.put("skillName", req.getSkillName());

        NotificationType notifType;
        String title;
        String message;

        switch (newStatus) {
            case ACCEPTED:
                notifType = NotificationType.REQUEST_ACCEPTED;
                title = "Request Accepted";
                message = "Your request for '" + req.getSkillName() + "' was accepted.";
                break;

            case REJECTED:
                notifType = NotificationType.REQUEST_REJECTED;
                title = "Request Rejected";
                message = "Your request for '" + req.getSkillName() + "' was rejected.";
                break;

            case COMPLETED:
                notifType = NotificationType.SESSION_UPDATE;
                title = "Request Completed";
                message = "Your session for '" + req.getSkillName() + "' has been marked completed.";
                break;

            default:
                notifType = NotificationType.GENERIC;
                title = "Request Updated";
                message = "Your request status changed.";
        }

        Notification notify = Notification.builder()
                .userId(req.getSeekerId())
                .type(notifType)
                .title(title)
                .message(message)
                .metadata(meta)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();

        notificationService.createNotification(notify);

        return updated;
    }

    @Override
    public Optional<SkillRequest> getById(String requestId) {
        return skillRequestRepository.findById(requestId);
    }

    /**
     * Tries to resolve providerIdentifier to canonical user id.
     * Handles Optional<User> from userRepository for all lookup methods.
     */
    private String resolveProviderId(String providerIdentifier) {
        if (providerIdentifier == null) return null;

        // try primary id (returns Optional<User>)
        Optional<User> byId = userRepository.findById(providerIdentifier);
        if (byId.isPresent()) return byId.get().getId();

        // try studentId (Optional<User>)
        Optional<User> byStudentOpt = userRepository.findByStudentId(providerIdentifier);
        if (byStudentOpt.isPresent()) return byStudentOpt.get().getId();

        // try email (Optional<User>)
        Optional<User> byEmailOpt = userRepository.findByEmail(providerIdentifier);
        if (byEmailOpt.isPresent()) return byEmailOpt.get().getId();

        return null;
    }
}
