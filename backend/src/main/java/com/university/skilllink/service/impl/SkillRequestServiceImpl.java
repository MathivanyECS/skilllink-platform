package com.university.skilllink.service.impl;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.NotificationType;
import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.SkillRequestRepository;
import com.university.skilllink.repository.UserRepository;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.RequestService;
import com.university.skilllink.service.SessionBoardService;
import com.university.skilllink.dto.sessionboard.CreateSessionBoardDTO;
import com.university.skilllink.dto.sessionboard.SessionBoardDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SkillRequestServiceImpl implements RequestService {

    private final SkillRequestRepository skillRequestRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final SessionBoardService sessionBoardService;

    // ======================================================
    // SEND REQUEST (SEEKER → PROVIDER)
    // ======================================================
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

        // ✅ FETCH SEEKER USER
        User seeker = userRepository.findById(seekerId)
                .orElseThrow(() -> new RuntimeException("Seeker not found: " + seekerId));

        // ✅ FETCH PROVIDER USER (FOR SEEKER NOTIFICATION)
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found: " + providerId));

        // ======================================================
        // 🔔 PROVIDER NOTIFICATION (NEW REQUEST)
        // ======================================================
        Map<String, String> meta = new HashMap<>();
        meta.put("requestId", saved.getId());
        meta.put("skillName", skillName);
        meta.put("studentId", seeker.getStudentId() != null ? seeker.getStudentId() : "");
        meta.put("studentName", seeker.getFullName() != null ? seeker.getFullName() : "");
        meta.put("note", note != null ? note : "");

        Notification notification = Notification.builder()
                .userId(providerId)
                .type(NotificationType.NEW_REQUEST)
                .title("New skill request")
                .message("You received a new request for '" + skillName + "'")
                .metadata(meta)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();

        notificationService.createNotification(notification);

        // ======================================================
        // 🔔 SEEKER NOTIFICATION (REQUEST SENT → PENDING)
        // ======================================================
        notificationService.sendRequestSentNotification(
                seekerId,
                skillName,
                provider.getFullName());

        return saved;
    }

    // ======================================================
    // GET REQUESTS
    // ======================================================
    @Override
    public List<SkillRequest> getIncomingRequests(String providerId) {
        if (providerId == null)
            return Collections.emptyList();
        return skillRequestRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
    }

    @Override
    public List<SkillRequest> getSentRequests(String seekerId) {
        if (seekerId == null)
            return Collections.emptyList();
        return skillRequestRepository.findBySeekerIdOrderByCreatedAtDesc(seekerId);
    }

    // ======================================================
    // UPDATE STATUS (PROVIDER → SEEKER)
    // ======================================================
    @Override
    public SkillRequest updateStatus(String requestId, String actorId, String status) {

        SkillRequest req = skillRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new RuntimeException("Actor user not found: " + actorId));

        boolean authorized = actorId.equals(req.getProviderId()) ||
                (actor.getStudentId() != null && actor.getStudentId().equals(req.getProviderId())) ||
                actor.getEmail().equals(req.getProviderId());

        if (!authorized) {
            throw new RuntimeException("Only provider can update status");
        }

        // 🔥 PREVENT DUPLICATE RESPONSES
        if (req.getStatus() != SkillRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed as " + req.getStatus());
        }

        SkillRequest.RequestStatus newStatus = SkillRequest.RequestStatus.valueOf(status.toUpperCase());

        req.setStatus(newStatus);
        req.setUpdatedAt(LocalDateTime.now());
        SkillRequest updated = skillRequestRepository.save(req);

        // ======================================================
        // 🔔 SEEKER NOTIFICATION (ACCEPT / REJECT)
        // ======================================================
        User provider = userRepository.findById(req.getProviderId()).orElse(null);

        Map<String, String> meta = new HashMap<>();
        meta.put("requestId", req.getId());
        meta.put("skillName", req.getSkillName());
        meta.put("status", newStatus.name());

        meta.put("providerStudentId",
                provider != null && provider.getStudentId() != null
                        ? provider.getStudentId()
                        : "");

        meta.put("providerName",
                provider != null && provider.getFullName() != null
                        ? provider.getFullName()
                        : "");

        NotificationType notifType;
        String title;
        String message;

        switch (newStatus) {
            case ACCEPTED:
                notifType = NotificationType.REQUEST_ACCEPTED;
                title = "Request Accepted";
                message = "Your request for '" + req.getSkillName() + "' was accepted.";

                try {
                    CreateSessionBoardDTO dto = new CreateSessionBoardDTO();
                    dto.setSessionId(req.getId());
                    dto.setLearnerId(req.getSeekerId());
                    dto.setTeacherId(req.getProviderId());
                    sessionBoardService.createSessionBoard(dto);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;

            case REJECTED:
                notifType = NotificationType.REQUEST_REJECTED;
                title = "Request Rejected";
                message = "Your request for '" + req.getSkillName() + "' was rejected.";
                break;

            case COMPLETED:
                notifType = NotificationType.SESSION_UPDATE;
                title = "Session Completed";
                message = "Your session for '" + req.getSkillName() + "' is completed.";
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

    // ======================================================
    // RESOLVE PROVIDER ID
    // ======================================================
    private String resolveProviderId(String providerIdentifier) {
        if (providerIdentifier == null)
            return null;

        return userRepository.findById(providerIdentifier)
                .or(() -> userRepository.findByStudentId(providerIdentifier))
                .or(() -> userRepository.findByEmail(providerIdentifier))
                .map(User::getId)
                .orElse(null);
    }
}
