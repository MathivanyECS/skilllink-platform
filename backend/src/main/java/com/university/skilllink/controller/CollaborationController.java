package com.university.skilllink.controller;

import com.university.skilllink.dto.collaboration.CollabApplicationDTO;
import com.university.skilllink.dto.collaboration.CollabPostDTO;
import com.university.skilllink.model.CollaborationApplication;
import com.university.skilllink.model.CollaborationPost;
import com.university.skilllink.service.CollaborationService;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaborations")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"})
public class CollaborationController {

    private final CollaborationService collaborationService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<CollaborationPost> createPost(@RequestBody CollabPostDTO dto, Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();
        CollaborationPost created = collaborationService.createPost(userId, dto);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping
    public ResponseEntity<List<CollaborationPost>> listOpen() {
        return ResponseEntity.ok(collaborationService.listAllOpenPosts());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<CollaborationPost> getPost(@PathVariable String postId) {
        return ResponseEntity.ok(collaborationService.getPostById(postId));
    }

    @PostMapping("/{postId}/apply")
    public ResponseEntity<CollaborationApplication> apply(@PathVariable String postId,
                                                          @RequestBody CollabApplicationDTO dto,
                                                          Authentication auth) {
        String applicantId = userService.getUserByEmail(auth.getName()).getId();
        CollaborationApplication saved = collaborationService.applyToPost(applicantId, postId, dto);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping("/{postId}/applications")
    public ResponseEntity<List<CollaborationApplication>> getApplications(@PathVariable String postId, Authentication auth) {
        String userId = userService.getUserByEmail(auth.getName()).getId();
        return ResponseEntity.ok(collaborationService.listApplications(postId, userId));
    }

    @PutMapping("/{postId}/applications/{applicationId}")
    public ResponseEntity<CollaborationApplication> respond(@PathVariable String postId,
                                                            @PathVariable String applicationId,
                                                            @RequestParam("accept") boolean accept,
                                                            Authentication auth) {
        String userId = userService.getUserByEmail(auth.getName()).getId();
        CollaborationApplication updated = collaborationService.respondToApplication(postId, applicationId, userId, accept);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{postId}/close")
    public ResponseEntity<CollaborationPost> closePost(@PathVariable String postId, Authentication auth) {
        String userId = userService.getUserByEmail(auth.getName()).getId();
        return ResponseEntity.ok(collaborationService.closePost(postId, userId));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId, Authentication auth) {
        String userId = userService.getUserByEmail(auth.getName()).getId();
        collaborationService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }
}
