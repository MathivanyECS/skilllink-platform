package com.university.skilllink.controller;

import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.service.RequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin("*")
public class RequestController {

    private final RequestService service;

    public RequestController(RequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SkillRequest> createRequest(@RequestBody SkillRequest req) {
        return ResponseEntity.ok(service.createRequest(req));
    }

    @GetMapping("/outgoing/{userId}")
    public ResponseEntity<List<SkillRequest>> getOutgoing(@PathVariable String userId) {
        return ResponseEntity.ok(service.getOutgoing(userId));
    }

    @GetMapping("/incoming/{userId}")
    public ResponseEntity<List<SkillRequest>> getIncoming(@PathVariable String userId) {
        return ResponseEntity.ok(service.getIncoming(userId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SkillRequest> updateStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}
