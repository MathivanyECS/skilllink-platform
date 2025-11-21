package com.university.skilllink.service;

import com.university.skilllink.dto.sessionboard.SessionBoardDTO;
import com.university.skilllink.dto.sessionboard.CreateSessionBoardDTO;
import java.util.List;
import java.time.LocalDateTime; 

public interface SessionBoardService {
    SessionBoardDTO createSessionBoard(CreateSessionBoardDTO request);
    SessionBoardDTO getSessionBoardById(String id);
    SessionBoardDTO getSessionBoardBySessionId(String sessionId);
    List<SessionBoardDTO> getSessionBoardsByLearner(String learnerId);
    List<SessionBoardDTO> getSessionBoardsByTeacher(String teacherId);
    SessionBoardDTO updateMeeting(String sessionBoardId, LocalDateTime meetingDateTime, String meetingLocation);
    SessionBoardDTO updateProgressNotes(String sessionBoardId, String progressNotes);
}