package com.university.skilllink.repository;

import com.university.skilllink.model.CollaborationPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationPostRepository extends MongoRepository<CollaborationPost, String> {
    List<CollaborationPost> findByStatusOrderByCreatedAtDesc(String status);
    List<CollaborationPost> findByCreatedByOrderByCreatedAtDesc(String createdBy);
}
