
import api from "./api";
// Service
import { CollaborationPost, CollaborationApplication, CreatePostDTO, CreateApplicationDTO } from "../types/collaboration.types";

export const createPost = async (data: CreatePostDTO): Promise<CollaborationPost> => {
    const response = await api.post<CollaborationPost>("/collaborations", data);
    return response.data;
};

export const getAllPosts = async (): Promise<CollaborationPost[]> => {
    const response = await api.get<CollaborationPost[]>("/collaborations");
    return response.data;
};

export const getPostById = async (id: string): Promise<CollaborationPost> => {
    const response = await api.get<CollaborationPost>(`/collaborations/${id}`);
    return response.data;
};

export const applyToPost = async (postId: string, data: CreateApplicationDTO): Promise<CollaborationApplication> => {
    const response = await api.post<CollaborationApplication>(`/collaborations/${postId}/apply`, data);
    return response.data;
};

export const getApplications = async (postId: string): Promise<CollaborationApplication[]> => {
    const response = await api.get<CollaborationApplication[]>(`/collaborations/${postId}/applications`);
    return response.data;
};

export const respondToApplication = async (postId: string, applicationId: string, accept: boolean): Promise<CollaborationApplication> => {
    const response = await api.put<CollaborationApplication>(`/collaborations/${postId}/applications/${applicationId}?accept=${accept}`, {});
    return response.data;
};

export const closePost = async (postId: string): Promise<CollaborationPost> => {
    const response = await api.put<CollaborationPost>(`/collaborations/${postId}/close`, {});
    return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
    await api.delete(`/collaborations/${postId}`);
};