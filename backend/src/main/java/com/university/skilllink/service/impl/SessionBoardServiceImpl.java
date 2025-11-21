package com.university.skilllink.service.impl;

import com.university.skilllink.model.SessionBoard;
import com.university.skilllink.repository.SessionBoardRepository;
import com.university.skilllink.service.SessionBoardService;
import com.university.skilllink.dto.sessionboard.SessionBoardDTO;
import com.university.skilllink.dto.sessionboard.CreateSessionBoardDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionBoardServiceImpl implements SessionBoardService {
    
    private final SessionBoardRepository sessionBoardRepository;
    
    @Override
    public SessionBoardDTO createSessionBoard(CreateSessionBoardDTO request) {
        // Check if session board already exists
        if (sessionBoardRepository.existsBySessionId(request.getSessionId())) {
            throw new RuntimeException("Session board already exists for this session");
        }
        
        SessionBoard sessionBoard = new SessionBoard();
        sessionBoard.setSessionId(request.getSessionId());
        sessionBoard.setLearnerId(request.getLearnerId());
        sessionBoard.setTeacherId(request.getTeacherId());
        sessionBoard.setCreatedAt(LocalDateTime.now());
        sessionBoard.setUpdatedAt(LocalDateTime.now());
        
        SessionBoard saved = sessionBoardRepository.save(sessionBoard);
        return convertToDTO(saved);
    }
    
    @Override
    public SessionBoardDTO getSessionBoardById(String id) {
        SessionBoard sessionBoard = sessionBoardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session board not found"));
        return convertToDTO(sessionBoard);
    }
    
    @Override
    public SessionBoardDTO getSessionBoardBySessionId(String sessionId) {
        SessionBoard sessionBoard = sessionBoardRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session board not found"));
        return convertToDTO(sessionBoard);
    }
    
    @Override
    public List<SessionBoardDTO> getSessionBoardsByLearner(String learnerId) {
        return sessionBoardRepository.findByLearnerId(learnerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<SessionBoardDTO> getSessionBoardsByTeacher(String teacherId) {
        return sessionBoardRepository.findByTeacherId(teacherId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public SessionBoardDTO updateMeeting(String sessionBoardId, LocalDateTime meetingDateTime, String meetingLocation) {
        SessionBoard sessionBoard = sessionBoardRepository.findById(sessionBoardId)
                .orElseThrow(() -> new RuntimeException("Session board not found"));
        
        sessionBoard.setMeetingDateTime(meetingDateTime);
        sessionBoard.setMeetingLocation(meetingLocation);
        sessionBoard.setUpdatedAt(LocalDateTime.now());
        
        SessionBoard updated = sessionBoardRepository.save(sessionBoard);
        return convertToDTO(updated);
    }
    
    @Override
    public SessionBoardDTO updateProgressNotes(String sessionBoardId, String progressNotes) {
        SessionBoard sessionBoard = sessionBoardRepository.findById(sessionBoardId)
                .orElseThrow(() -> new RuntimeException("Session board not found"));
        
        sessionBoard.setProgressNotes(progressNotes);
        sessionBoard.setUpdatedAt(LocalDateTime.now());
        
        SessionBoard updated = sessionBoardRepository.save(sessionBoard);
        return convertToDTO(updated);
    }
    
    private SessionBoardDTO convertToDTO(SessionBoard sessionBoard) {
        SessionBoardDTO dto = new SessionBoardDTO();
        dto.setId(sessionBoard.getId());
        dto.setSessionId(sessionBoard.getSessionId());
        dto.setLearnerId(sessionBoard.getLearnerId());
        dto.setTeacherId(sessionBoard.getTeacherId());
        dto.setMeetingDateTime(sessionBoard.getMeetingDateTime());
        dto.setMeetingLocation(sessionBoard.getMeetingLocation());
        dto.setProgressNotes(sessionBoard.getProgressNotes());
        dto.setLastMessageAt(sessionBoard.getLastMessageAt());
        dto.setCreatedAt(sessionBoard.getCreatedAt());
        dto.setUpdatedAt(sessionBoard.getUpdatedAt());
        return dto;
    }
}