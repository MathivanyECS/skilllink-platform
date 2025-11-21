package com.university.skilllink.controller;

import com.university.skilllink.dto.Request.RequestDTO;
import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.service.RequestService;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"})
public class SkillRequestController {

    private final RequestService requestService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<SkillRequest> sendRequest(@RequestBody RequestDTO dto, Authentication auth) {
        String seekerEmail = auth.getName();
        String seekerId = userService.getUserByEmail(seekerEmail).getId();

        SkillRequest req = requestService.sendRequest(seekerId, dto.getProviderId(), dto.getSkillName(), dto.getNote());
        return ResponseEntity.status(201).body(req);
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<SkillRequest>> incoming(Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();
        return ResponseEntity.ok(requestService.getIncomingRequests(userId));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<SkillRequest>> sent(Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();
        return ResponseEntity.ok(requestService.getSentRequests(userId));
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<SkillRequest> updateStatus(
            @PathVariable String requestId,
            @RequestParam("status") String status,
            Authentication auth
    ) {
        String email = auth.getName();
        String actorId = userService.getUserByEmail(email).getId();
        SkillRequest updated = requestService.updateStatus(requestId, actorId, status);
        return ResponseEntity.ok(updated);
    }
}