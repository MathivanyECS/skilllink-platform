package com.university.skilllink.service;

import com.university.skilllink.dto.sessionboard.SessionBoardDTO;
import com.university.skilllink.dto.sessionboard.CreateSessionBoardDTO;
import java.util.List;
import java.time.LocalDateTime; 
/**
 * Service interface for SessionBoard business logic
 * Defines contract for session board operations
 * 
 * @version 1.0
 */

public interface SessionBoardService {
    /**
     * Create a new session board for a learning session
     * @param request DTO containing session creation data
     * @return Created session board DTO
     * @throws RuntimeException if session board already exists
     */
    SessionBoardDTO createSessionBoard(CreateSessionBoardDTO request);
    SessionBoardDTO getSessionBoardById(String id);
    SessionBoardDTO getSessionBoardBySessionId(String sessionId);
    List<SessionBoardDTO> getSessionBoardsByLearner(String learnerId);
    List<SessionBoardDTO> getSessionBoardsByTeacher(String teacherId);
    SessionBoardDTO updateMeeting(String sessionBoardId, LocalDateTime meetingDateTime, String meetingLocation);
    SessionBoardDTO updateProgressNotes(String sessionBoardId, String progressNotes);
}