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
                .type(NotificationType.NEW_REQUEST)
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
        System.out.println("🎯 [DEBUG] updateStatus called");
        System.out.println("🎯 [DEBUG] requestId: " + requestId);
        System.out.println("🎯 [DEBUG] actorId: " + actorId);
        System.out.println("🎯 [DEBUG] status param: " + status);

        SkillRequest req = skillRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        Optional<User> actorOpt = userRepository.findById(actorId);
        if (actorOpt.isEmpty()) {
            throw new RuntimeException("Actor user not found: " + actorId);
        }
        User actor = actorOpt.get();

        String actorStudentId = actor.getStudentId();
        String actorEmail = actor.getEmail();

        boolean okById = actorId != null && actorId.equals(req.getProviderId());
        boolean okByStudent = actorStudentId != null && actorStudentId.equals(req.getProviderId());
        boolean okByEmail = actorEmail != null && actorEmail.equals(req.getProviderId());

        if (!(okById || okByStudent || okByEmail)) {
            throw new RuntimeException("Only the provider can change request status.");
        }

        SkillRequest.RequestStatus newStatus;
        try {
            newStatus = SkillRequest.RequestStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid status: " + status);
        }

        req.setStatus(newStatus);
        req.setUpdatedAt(LocalDateTime.now());
        SkillRequest updated = skillRequestRepository.save(req);

        Map<String, String> meta = new HashMap<>();
        meta.put("requestId", req.getId());
        meta.put("providerId", req.getProviderId());
        meta.put("skillName", req.getSkillName());

        NotificationType notifType;
        String title;
        String message;

        System.out.println("🎯 [DEBUG] New status: " + newStatus);

        switch (newStatus) {
            case ACCEPTED:
                System.out.println("🔥 ACCEPTED CASE ENTERED");

                notifType = NotificationType.REQUEST_ACCEPTED;
                title = "Request Accepted";
                message = "Your request for '" + req.getSkillName() + "' was accepted.";

                try {
                    // ✅ Directly create session board via service
                    CreateSessionBoardDTO createDTO = new CreateSessionBoardDTO();
                    createDTO.setSessionId(req.getId());
                    createDTO.setLearnerId(req.getSeekerId());
                    createDTO.setTeacherId(req.getProviderId());

                    SessionBoardDTO sessionBoard = sessionBoardService.createSessionBoard(createDTO);

                    if (req.getSkillName() != null && !req.getSkillName().isEmpty()) {
                        sessionBoardService.updateProgressNotes(
                                sessionBoard.getId(),
                                "Learning session for: " + req.getSkillName()
                        );
                    }

                    System.out.println("✅ Session board created for request: " + req.getId());

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

    private String resolveProviderId(String providerIdentifier) {
        if (providerIdentifier == null) return null;

        Optional<User> byId = userRepository.findById(providerIdentifier);
        if (byId.isPresent()) return byId.get().getId();

        Optional<User> byStudentOpt = userRepository.findByStudentId(providerIdentifier);
        if (byStudentOpt.isPresent()) return byStudentOpt.get().getId();

        Optional<User> byEmailOpt = userRepository.findByEmail(providerIdentifier);
        if (byEmailOpt.isPresent()) return byEmailOpt.get().getId();

        return null;
    }
}
