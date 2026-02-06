/**
 * Collaboration Service
 * 
 * Handles all API calls related to the Collaboration module.
 * Uses the existing api.ts axios instance which includes JWT token injection.
 */

import api from "./api";
import {
  CollaborationPost,
  CollaborationApplication,
  CollabPostDTO,
  CollabApplicationDTO
} from "../types/collaboration.types";

/**
 * Create a new collaboration post
 * POST /api/collaborations
 * Requires authentication (JWT token)
 */
export const createPost = async (dto: CollabPostDTO): Promise<CollaborationPost> => {
  const response = await api.post<CollaborationPost>("/collaborations", dto);
  return response.data;
};

/**
 * Get all open collaboration posts
 * GET /api/collaborations
 * Public endpoint (no auth required)
 */
export const getAllOpenPosts = async (): Promise<CollaborationPost[]> => {
  const response = await api.get<CollaborationPost[]>("/collaborations");
  return response.data;
};

/**
 * Get a single collaboration post by ID
 * GET /api/collaborations/{postId}
 * Public endpoint (no auth required)
 */
export const getPostById = async (postId: string): Promise<CollaborationPost> => {
  const response = await api.get<CollaborationPost>(`/collaborations/${postId}`);
  return response.data;
};

/**
 * Apply to a collaboration post
 * POST /api/collaborations/{postId}/apply
 * Requires authentication (JWT token)
 */
export const applyToPost = async (
  postId: string,
  dto: CollabApplicationDTO
): Promise<CollaborationApplication> => {
  const response = await api.post<CollaborationApplication>(
    `/collaborations/${postId}/apply`,
    dto
  );
  return response.data;
};

/**
 * Get all applications for a post (owner only)
 * GET /api/collaborations/{postId}/applications
 * Requires authentication and ownership verification
 */
export const getPostApplications = async (
  postId: string
): Promise<CollaborationApplication[]> => {
  const response = await api.get<CollaborationApplication[]>(
    `/collaborations/${postId}/applications`
  );
  return response.data;
};

/**
 * Accept or reject an application
 * PUT /api/collaborations/{postId}/applications/{applicationId}?accept=true|false
 * Requires authentication and ownership verification
 */
export const respondToApplication = async (
  postId: string,
  applicationId: string,
  accept: boolean
): Promise<CollaborationApplication> => {
  const response = await api.put<CollaborationApplication>(
    `/collaborations/${postId}/applications/${applicationId}`,
    null,
    {
      params: { accept }
    }
  );
  return response.data;
};

/**
 * Close a collaboration post
 * PUT /api/collaborations/{postId}/close
 * Requires authentication and ownership verification
 */
export const closePost = async (postId: string): Promise<CollaborationPost> => {
  const response = await api.put<CollaborationPost>(`/collaborations/${postId}/close`);
  return response.data;
};

/**
 * Delete a collaboration post
 * DELETE /api/collaborations/{postId}
 * Requires authentication and ownership verification
 */
export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/collaborations/${postId}`);
};
