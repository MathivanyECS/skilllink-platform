package com.university.skilllink.controller;

import com.university.skilllink.dto.sessionboard.SessionBoardDTO;
import com.university.skilllink.dto.sessionboard.CreateSessionBoardDTO;
import com.university.skilllink.model.SkillRequest;
import com.university.skilllink.repository.SkillRequestRepository;
import com.university.skilllink.service.SessionBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/session-boards")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SessionBoardController {
    
    private final SessionBoardService sessionBoardService;
    private final SkillRequestRepository skillRequestRepository; // Added for validation
    
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

    // ✅ UPDATED ENDPOINT WITH VALIDATION
    @PostMapping("/create-from-request")
    public ResponseEntity<SessionBoardDTO> createFromRequest(@RequestBody Map<String, String> requestData) {
        // Extract data from Member 2
        String requestId = requestData.get("requestId");
        String seekerId = requestData.get("seekerId");
        String providerId = requestData.get("providerId");
        String skillName = requestData.get("skillName");
        
        // Validate required fields
        if (requestId == null || seekerId == null || providerId == null) {
            return ResponseEntity.badRequest().body(null);
        }
        
        try {
            // 1. VALIDATE: Check if request exists
            SkillRequest skillRequest = skillRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Skill request not found with ID: " + requestId));
            
            // 2. VALIDATE: Check if request is ACCEPTED
            if (skillRequest.getStatus() != SkillRequest.RequestStatus.ACCEPTED) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null); // Or return error message
            }
            
            // 3. VALIDATE: Check if IDs match
            if (!skillRequest.getSeekerId().equals(seekerId) || 
                !skillRequest.getProviderId().equals(providerId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null); // IDs don't match the request
            }
            
            // 4. Check if session board already exists for this request
            // This check is already in SessionBoardServiceImpl.createSessionBoard()
            
            // 5. Create session board DTO
            CreateSessionBoardDTO createDTO = new CreateSessionBoardDTO();
            createDTO.setSessionId(requestId);      // Use requestId as sessionId
            createDTO.setLearnerId(seekerId);       // seekerId becomes learnerId
            createDTO.setTeacherId(providerId);     // providerId becomes teacherId
            
            // 6. Create session board
            SessionBoardDTO sessionBoard = sessionBoardService.createSessionBoard(createDTO);
            
            // 7. Add skill name to progress notes
            if (skillName != null && !skillName.isEmpty()) {
                sessionBoardService.updateProgressNotes(
                    sessionBoard.getId(), 
                    "Learning session for: " + skillName
                );
            }
            
            System.out.println("✅ Session board created for ACCEPTED request: " + requestId);
            return ResponseEntity.ok(sessionBoard);
            
        } catch (RuntimeException e) {
            // Handle validation errors
            System.out.println("❌ Validation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            // Handle other errors
            System.out.println("❌ Failed to create session board: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}