package com.university.skilllink.controller;

import com.university.skilllink.dto.auth.RequestDTO;
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

    /**
     * Send a new skill request.
     * DEV-FRIENDLY: if auth is null, allows seekerId in body for testing.
     */
    @PostMapping
    public ResponseEntity<SkillRequest> sendRequest(@RequestBody RequestDTO dto, Authentication auth) {
        String seekerId = null;
        if (auth != null && auth.isAuthenticated()) {
            String seekerEmail = auth.getName();
            var user = userService.getUserByEmail(seekerEmail);
            if (user == null) return ResponseEntity.status(401).build();
            seekerId = user.getId();
        } else {
            // DEV fallback: allow manual seekerId in DTO for Postman testing
            if (dto.getSeekerId() != null) seekerId = dto.getSeekerId();
            else return ResponseEntity.status(401).build();
        }

        // At this point seekerId must be the canonical user.id (from users collection)
        SkillRequest req = requestService.sendRequest(seekerId, dto.getProviderId(), dto.getSkillName(), dto.getNote());
        return ResponseEntity.status(201).body(req);
    }

    /**
     * Incoming requests for currently authenticated user (provider).
     * Adds debug logging so you can see what id is being used.
     */
    @GetMapping("/incoming")
public ResponseEntity<List<SkillRequest>> incoming(Authentication auth) {
    if (auth == null || !auth.isAuthenticated()) {
        return ResponseEntity.status(401).build();
    }

    String email = auth.getName();
    System.out.println("[DEBUG] /incoming called by auth.email=" + email);

    var user = userService.getUserByEmail(email);
    if (user == null) {
        System.out.println("[DEBUG] userService.getUserByEmail returned null for email=" + email);
        return ResponseEntity.ok(List.of()); // keep safe response
    }

    // Try canonical id first
    String userId = user.getId();
    System.out.println("[DEBUG] trying providerId (canonical) = " + userId);
    var list = requestService.getIncomingRequests(userId);
    if (list != null && !list.isEmpty()) {
        System.out.println("[DEBUG] incoming count by canonical id = " + list.size());
        return ResponseEntity.ok(list);
    }

    // If nothing, try studentId (or other identifier stored in your requests)
    // NOTE: replace getStudentId() with the actual field name if different
    try {
        String studentId = (String) user.getClass().getMethod("getStudentId").invoke(user);
        if (studentId != null && !studentId.isBlank()) {
            System.out.println("[DEBUG] trying providerId (studentId) = " + studentId);
            var list2 = requestService.getIncomingRequests(studentId);
            System.out.println("[DEBUG] incoming count by studentId = " + (list2 == null ? 0 : list2.size()));
            return ResponseEntity.ok(list2 == null ? List.of() : list2);
        }
    } catch (NoSuchMethodException nsme) {
        // user doesn't have getStudentId() — ignore quietly
    } catch (Exception ex) {
        // reflection failed — print for debug
        ex.printStackTrace();
    }

    // Nothing found — return empty list
    System.out.println("[DEBUG] no incoming requests found for user id or studentId");
    return ResponseEntity.ok(List.of());
}


    @GetMapping("/sent")
    public ResponseEntity<List<SkillRequest>> sent(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();
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
    if (auth == null || !auth.isAuthenticated()) {
        return ResponseEntity.status(401).build();
    }

    // Provider who is accepting/rejecting
    String email = auth.getName();
    var user = userService.getUserByEmail(email);
    if (user == null) {
        return ResponseEntity.status(401).build();
    }

    String actorId = user.getId();   // canonical provider ID

    // Update via service
    SkillRequest updated = requestService.updateStatus(requestId, actorId, status);

    return ResponseEntity.ok(updated);
}

    @GetMapping("/debug/whoami")
    public ResponseEntity<String> whoami(Authentication auth) {
        if (auth == null) return ResponseEntity.ok("auth null");
        String email = auth.getName();
        var user = userService.getUserByEmail(email);
        if (user == null) return ResponseEntity.ok("user not found for email: " + email);
        return ResponseEntity.ok("email=" + email + " id=" + user.getId());
    }

    /**
     * Return incoming requests for any providerId (bypasses auth).
     * Use the exact providerId string that you see stored in DB to test repository querying.
     */
    @GetMapping("/debug/incoming/{providerId}")
    public ResponseEntity<List<SkillRequest>> debugIncomingById(@PathVariable String providerId) {
        var list = requestService.getIncomingRequests(providerId);
        return ResponseEntity.ok(list);
    }
}
