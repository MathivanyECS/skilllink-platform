import axios from "axios";
import {
  ActiveUserDTO,
  AdminRegisterRequest,
  CollabPostDTO,
  CollabStatsDTO,
  NotificationDTO,
  OfferedSkillDTO,
  SkillGapReportDTO,
  TopSkillProviderDTO,
  UserDTO,
} from "../types/admin";

/**
 * Axios instance
 * - Base URL: update if needed
 * - Adds Authorization header automatically from localStorage
 */
const api = axios.create({
  baseURL: "http://localhost:8081", 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ==============================
   1) Admin Account Management
============================== */
export async function createAdmin(body: AdminRegisterRequest): Promise<UserDTO> {
  const { data } = await api.post("/api/admin/create", body);
  return data;
}

/* ==============================
   2) User Monitoring & Control
============================== */
export async function getAllUsers(): Promise<UserDTO[]> {
  const { data } = await api.get("/api/admin/users");
  return data;
}

export async function getUserById(id: string): Promise<UserDTO> {
  const { data } = await api.get(`/api/admin/users/${id}`);
  return data;
}

export async function activateUser(id: string): Promise<{ message: string }> {
  const { data } = await api.put(`/api/admin/users/${id}/activate`);
  return data;
}

export async function deactivateUser(id: string): Promise<{ message: string }> {
  const { data } = await api.put(`/api/admin/users/${id}/deactivate`);
  return data;
}

export async function getActiveUsers(): Promise<ActiveUserDTO[]> {
  const { data } = await api.get("/api/admin/active-users");
  return data;
}

/* ==============================
   3) Skill & User Activity Oversight
============================== */
export async function getUserOfferedSkills(id: string): Promise<OfferedSkillDTO[]> {
  const { data } = await api.get(`/api/admin/users/${id}/offered-skills`);
  return data;
}

export async function getUserDesiredSkills(id: string): Promise<string[]> {
  const { data } = await api.get(`/api/admin/users/${id}/desired-skills`);
  return data;
}

/* ==============================
   4) Content Moderation
============================== */
export async function getAllCollaborationPosts(): Promise<CollabPostDTO[]> {
  const { data } = await api.get("/api/admin/collaboration-posts");
  return data;
}

export async function deleteCollaborationPost(postId: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/api/admin/collaboration-posts/${postId}`);
  return data;
}

/* ==============================
   5) Notifications Management
============================== */
export async function getUserNotifications(id: string): Promise<NotificationDTO[]> {
  const { data } = await api.get(`/api/admin/users/${id}/notifications`);
  return data;
}

export async function clearUserNotifications(id: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/api/admin/users/${id}/notifications`);
  return data;
}

/* ==============================
   6) Analytics & Reports
============================== */
export async function getTopSkillProviders(): Promise<TopSkillProviderDTO[]> {
  const { data } = await api.get("/api/admin/reports/top-skill-providers");
  return data;
}

export async function getSkillGapReport(): Promise<SkillGapReportDTO[]> {
  const { data } = await api.get("/api/admin/reports/skill-gap");
  return data;
}

export async function getCollaborationStats(): Promise<CollabStatsDTO> {
  const { data } = await api.get("/api/admin/reports/collaboration-stats");
  return data;
}
