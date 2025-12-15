package com.university.skilllink.repository;

import com.university.skilllink.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // All notifications for a user sorted newest-first
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    // Unread notifications for a user sorted newest-first
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);

    // Count unread notifications for a user
    long countByUserIdAndReadFalse(String userId);

    // Delete all notifications for a user
    void deleteByUserId(String userId);
}
