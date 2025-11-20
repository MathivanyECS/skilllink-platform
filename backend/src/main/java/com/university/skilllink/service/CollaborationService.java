package com.university.skilllink.service;

import com.university.skilllink.dto.collaboration.CollabApplicationDTO;
import com.university.skilllink.dto.collaboration.CollabPostDTO;
import com.university.skilllink.model.CollaborationApplication;
import com.university.skilllink.model.CollaborationPost;

import java.util.List;

public interface CollaborationService {

    CollaborationPost createPost(String creatorUserId, CollabPostDTO dto);

    List<CollaborationPost> listAllOpenPosts();

    CollaborationPost getPostById(String postId);

    CollaborationPost updatePost(String postId, String userId, CollabPostDTO dto);

    void deletePost(String postId, String userId);

    CollaborationApplication applyToPost(String applicantUserId, String postId, CollabApplicationDTO dto);

    List<CollaborationApplication> listApplications(String postId, String userId);

    CollaborationApplication respondToApplication(String postId, String applicationId, String userId, boolean accept);

    CollaborationPost closePost(String postId, String userId);
}
