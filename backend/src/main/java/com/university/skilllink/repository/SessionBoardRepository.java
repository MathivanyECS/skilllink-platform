package com.university.skilllink.repository;

import com.university.skilllink.model.SessionBoard;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface SessionBoardRepository extends MongoRepository<SessionBoard, String> {
    Optional<SessionBoard> findBySessionId(String sessionId);
    List<SessionBoard> findByLearnerId(String learnerId);
    List<SessionBoard> findByTeacherId(String teacherId);
    boolean existsBySessionId(String sessionId);
}