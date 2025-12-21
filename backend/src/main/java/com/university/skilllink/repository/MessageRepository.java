package com.university.skilllink.repository;

import com.university.skilllink.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySessionBoardIdOrderByTimestampAsc(String sessionBoardId);
    List<Message> findBySessionBoardIdAndTimestampAfter(String sessionBoardId, LocalDateTime timestamp);
    Long countBySessionBoardIdAndIsReadFalseAndSenderIdNot(String sessionBoardId, String senderId);
}