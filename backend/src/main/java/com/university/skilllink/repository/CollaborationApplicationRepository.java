package com.university.skilllink.repository;

import com.university.skilllink.model.CollaborationApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationApplicationRepository extends MongoRepository<CollaborationApplication, String> {
    List<CollaborationApplication> findByPostId(String postId);
    List<CollaborationApplication> findByApplicantId(String applicantId);
}
