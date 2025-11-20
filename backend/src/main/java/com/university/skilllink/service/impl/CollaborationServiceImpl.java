package com.university.skilllink.service.impl;

import com.university.skilllink.dto.collaboration.CollabApplicationDTO;
import com.university.skilllink.dto.collaboration.CollabPostDTO;
import com.university.skilllink.exception.ForbiddenException;
import com.university.skilllink.exception.ResourceNotFoundException;
import com.university.skilllink.model.CollaborationApplication;
import com.university.skilllink.model.CollaborationPost;
import com.university.skilllink.model.Notification;
import com.university.skilllink.model.User;
import com.university.skilllink.repository.CollaborationApplicationRepository;
import com.university.skilllink.repository.CollaborationPostRepository;
import com.university.skilllink.service.CollaborationService;
import com.university.skilllink.service.NotificationService;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CollaborationServiceImpl implements CollaborationService {

    private final CollaborationPostRepository postRepo;
    private final CollaborationApplicationRepository appRepo;
    private final NotificationService notificationService;
    private final UserService userService;

    @Override
    public CollaborationPost createPost(String creatorUserId, CollabPostDTO dto) {
        CollaborationPost post = CollaborationPost.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .duration(dto.getDuration())
                .requiredSkills(dto.getRequiredSkills())
                .createdBy(creatorUserId)
                .status("OPEN")
                .createdAt(LocalDateTime.now())
                .build();
        return postRepo.save(post);
    }

    @Override
    public List<CollaborationPost> listAllOpenPosts() {
        return postRepo.findByStatusOrderByCreatedAtDesc("OPEN");
    }

    @Override
    public CollaborationPost getPostById(String postId) {
        return postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Collaboration post not found"));
    }

    @Override
    public CollaborationPost updatePost(String postId, String userId, CollabPostDTO dto) {
        CollaborationPost post = getPostById(postId);
        if (!post.getCreatedBy().equals(userId)) throw new ForbiddenException("Only creator can edit post");
        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());
        post.setCategory(dto.getCategory());
        post.setDuration(dto.getDuration());
        post.setRequiredSkills(dto.getRequiredSkills());

        // Optional: Notify followers or previous applicants about updates
        // You can add notificationService.send(...) here if needed

        return postRepo.save(post);
    }

    @Override
    public void deletePost(String postId, String userId) {
        CollaborationPost post = getPostById(postId);
        if (!post.getCreatedBy().equals(userId)) throw new ForbiddenException("Only creator can delete post");

        // Notify all applicants that the post is deleted
        List<CollaborationApplication> apps = appRepo.findByPostId(postId);
        for (CollaborationApplication a : apps) {
            notificationService.send(
                    a.getApplicantId(),
                    Notification.NotificationType.COLLAB,
                    "A collaboration post you applied for was deleted by the creator.",
                    "/collaborations/" + postId
            );
        }

        // Delete all applications
        appRepo.deleteAll(apps);
        postRepo.delete(post);
    }

    @Override
    public CollaborationApplication applyToPost(String applicantUserId, String postId, CollabApplicationDTO dto) {
        CollaborationPost post = getPostById(postId);
        if (!"OPEN".equals(post.getStatus())) throw new ForbiddenException("Post not open for applications");

        // Prevent duplicate applications
        List<CollaborationApplication> existing = appRepo.findByPostId(postId);
        boolean alreadyApplied = existing.stream()
                .anyMatch(a -> a.getApplicantId().equals(applicantUserId));
        if (alreadyApplied) throw new ForbiddenException("You already applied to this post");

        CollaborationApplication app = CollaborationApplication.builder()
                .postId(postId)
                .applicantId(applicantUserId)
                .message(dto.getMessage())
                .status(CollaborationApplication.ApplicationStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build();

        CollaborationApplication savedApp = appRepo.save(app);

        // Add applicant ID to post
        post.getApplicants().add(applicantUserId);
        postRepo.save(post);

        // Notify post creator about new application
        User applicant = userService.getUserById(applicantUserId);
        String applicantName = applicant != null ? applicant.getFullName() : "Someone";
        String content = String.format("%s applied to your collaboration post: %s", applicantName, post.getTitle());
        notificationService.send(post.getCreatedBy(), Notification.NotificationType.NEW_REQUEST, content, "/collaborations/" + post.getId());

        return savedApp;
    }

    @Override
    public List<CollaborationApplication> listApplications(String postId, String userId) {
        CollaborationPost post = getPostById(postId);
        if (!post.getCreatedBy().equals(userId)) throw new ForbiddenException("Only creator can view applications");
        return appRepo.findByPostId(postId);
    }

    @Override
    public CollaborationApplication respondToApplication(String postId, String applicationId, String userId, boolean accept) {
        CollaborationPost post = getPostById(postId);
        if (!post.getCreatedBy().equals(userId)) throw new ForbiddenException("Only creator can respond");

        CollaborationApplication app = appRepo.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!app.getPostId().equals(postId)) throw new ForbiddenException("Application does not belong to this post");

        app.setStatus(accept ? CollaborationApplication.ApplicationStatus.ACCEPTED : CollaborationApplication.ApplicationStatus.REJECTED);
        app.setRespondedAt(LocalDateTime.now());
        CollaborationApplication savedApp = appRepo.save(app);

        String content = accept ?
                String.format("Your application to '%s' was accepted.", post.getTitle()) :
                String.format("Your application to '%s' was rejected by the post creator.", post.getTitle());

        Notification.NotificationType type = accept ? Notification.NotificationType.ACCEPTED : Notification.NotificationType.REJECTED;

        // Send notification to applicant
        notificationService.send(app.getApplicantId(), type, content, "/collaborations/" + post.getId());

        // If accepted, mark post as filled
        if (accept) {
            post.setStatus("FILLED");
            postRepo.save(post);
        }

        return savedApp;
    }

    @Override
    public CollaborationPost closePost(String postId, String userId) {
        CollaborationPost post = getPostById(postId);
        if (!post.getCreatedBy().equals(userId)) throw new ForbiddenException("Only creator can close post");

        post.setStatus("CLOSED");

        // Optional: notify all applicants that post is closed
        List<CollaborationApplication> apps = appRepo.findByPostId(postId);
        for (CollaborationApplication a : apps) {
            notificationService.send(
                    a.getApplicantId(),
                    Notification.NotificationType.COLLAB,
                    "The collaboration post you applied for has been closed by the creator.",
                    "/collaborations/" + postId
            );
        }

        return postRepo.save(post);
    }
}
