package com.university.skilllink.controller;

import com.university.skilllink.model.Notification;
import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.repository.NotificationRepository;
import com.university.skilllink.repository.SkillRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/skill-requests")
@RequiredArgsConstructor
public class SkillRequestController {

    private final SkillRequestRepository reqRepo;
    private final NotificationRepository notifRepo;

    @PostMapping
    public ResponseEntity<SkillRequest> create(@RequestBody SkillRequest r){
        r.setCreatedAt(Instant.now());
        r.setStatus(SkillRequest.Status.PENDING);
        SkillRequest saved = reqRepo.save(r);

        // notify provider
        Notification n = new Notification();
        n.setUserId(saved.getProviderUserId());
        n.setTitle("New skill request");
        n.setBody("You have a new request for " + saved.getSkillName());
        n.setCreatedAt(Instant.now());
        notifRepo.save(n);

        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping("/incoming/{providerUserId}")
    public ResponseEntity<List<SkillRequest>> incoming(@PathVariable String providerUserId){
        return ResponseEntity.ok(reqRepo.findByProviderUserId(providerUserId));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<SkillRequest> accept(@PathVariable String id){
        SkillRequest r = reqRepo.findById(id).orElseThrow();
        r.setStatus(SkillRequest.Status.ACCEPTED);
        SkillRequest saved = reqRepo.save(r);
        // notify requester
        Notification n = new Notification();
        n.setUserId(saved.getRequesterId());
        n.setTitle("Request accepted");
        n.setBody("Your skill request was accepted. A session board will be created by the system.");
        n.setCreatedAt(Instant.now());
        notifRepo.save(n);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<SkillRequest> reject(@PathVariable String id){
        SkillRequest r = reqRepo.findById(id).orElseThrow();
        r.setStatus(SkillRequest.Status.REJECTED);
        SkillRequest saved = reqRepo.save(r);
        // notify requester
        Notification n = new Notification();
        n.setUserId(saved.getRequesterId());
        n.setTitle("Request rejected");
        n.setBody("Your skill request was rejected.");
        n.setCreatedAt(Instant.now());
        notifRepo.save(n);
        return ResponseEntity.ok(saved);
    }
}
