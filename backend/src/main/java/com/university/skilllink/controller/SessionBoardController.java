package com.university.skilllink.controller;

import com.university.skilllink.dto.sessionboard.SessionBoardDTO;
import com.university.skilllink.dto.sessionboard.CreateSessionBoardDTO;
import com.university.skilllink.service.SessionBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
/**
 * SessionBoardController - REST API endpoints for session board management
 * Handles CRUD operations for virtual classroom sessions
 * Secured with JWT authentication
 * Provides APIs for learners and teachers to manage sessions
 */

@RestController
@RequestMapping("/api/session-boards")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SessionBoardController {
    
    private final SessionBoardService sessionBoardService;
    
    @PostMapping
    public ResponseEntity<SessionBoardDTO> createSessionBoard(@Valid @RequestBody CreateSessionBoardDTO request) {
        SessionBoardDTO sessionBoard = sessionBoardService.createSessionBoard(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionBoard);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SessionBoardDTO> getSessionBoardById(@PathVariable String id) {
        SessionBoardDTO sessionBoard = sessionBoardService.getSessionBoardById(id);
        return ResponseEntity.ok(sessionBoard);
    }
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<SessionBoardDTO> getSessionBoardBySessionId(@PathVariable String sessionId) {
        SessionBoardDTO sessionBoard = sessionBoardService.getSessionBoardBySessionId(sessionId);
        return ResponseEntity.ok(sessionBoard);
    }
    
    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<SessionBoardDTO>> getSessionBoardsByLearner(@PathVariable String learnerId) {
        List<SessionBoardDTO> sessionBoards = sessionBoardService.getSessionBoardsByLearner(learnerId);
        return ResponseEntity.ok(sessionBoards);
    }
    
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<SessionBoardDTO>> getSessionBoardsByTeacher(@PathVariable String teacherId) {
        List<SessionBoardDTO> sessionBoards = sessionBoardService.getSessionBoardsByTeacher(teacherId);
        return ResponseEntity.ok(sessionBoards);
    }
    
    @PutMapping("/{id}/meeting")
    public ResponseEntity<SessionBoardDTO> updateMeeting(
            @PathVariable String id,
            @RequestParam LocalDateTime meetingDateTime,
            @RequestParam String meetingLocation) {
        SessionBoardDTO sessionBoard = sessionBoardService.updateMeeting(id, meetingDateTime, meetingLocation);
        return ResponseEntity.ok(sessionBoard);
    }
    
    @PutMapping("/{id}/progress-notes")
    public ResponseEntity<SessionBoardDTO> updateProgressNotes(
            @PathVariable String id,
            @RequestParam String progressNotes) {
        SessionBoardDTO sessionBoard = sessionBoardService.updateProgressNotes(id, progressNotes);
        return ResponseEntity.ok(sessionBoard);
    }
}