package com.university.skilllink.repository;

import com.university.skilllink.model.SessionBoard;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;
/**
 * Repository interface for SessionBoard entity
 * Provides data access operations for session board management
 * @version 1.0
 */

public interface SessionBoardRepository extends MongoRepository<SessionBoard, String> {
    /**
     * Find session board by session ID
     * @param sessionId The learning session ID
     * @return Optional containing session board if found
     */
    Optional<SessionBoard> findBySessionId(String sessionId);
    /**
     * Find all session boards where user is learner
     * @param learnerId The learner user ID
     * @return List of session boards for the learner
     */
    List<SessionBoard> findByLearnerId(String learnerId);
     /**
     * Find all session boards where user is teacher
     * @param teacherId The teacher user ID
     * @return List of session boards for the teacher
     */
    List<SessionBoard> findByTeacherId(String teacherId);
    /**
     * Check if session board exists for given session ID
     * @param sessionId The session ID to check
     * @return true if session board exists
     */
    boolean existsBySessionId(String sessionId);
}