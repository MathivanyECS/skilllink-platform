// Keep these aligned with your backend DTOs.
// If your field names differ, update types (frontend-only).

export type UserDTO = {
  id: string;
  username?: string;
  name?: string;
  email: string;
  role: "USER" | "ADMIN";
  active?: boolean; // if your backend uses isActive / status, adjust
  isActive?: boolean;
  isProfileCompleted?: boolean;
  createdAt?: string;
};

export type ActiveUserDTO = {
  userId: string;
  email?: string;
  username?: string;
  lastActiveAt?: string;
};

export type OfferedSkillDTO = {
  skillName: string;
  level?: string;
  description?: string;
};

export type NotificationDTO = {
  id?: string;
  message: string;
  createdAt?: string;
  read?: boolean;
};

export type CollabPostDTO = {
  id: string;
  title: string;
  description?: string;
  createdByUserId?: string;
  createdAt?: string;
  status?: "OPEN" | "CLOSED" | "COMPLETED";
  applicantsCount?: number;
};

export type TopSkillProviderDTO = {
  userId: string;
  email?: string;
  username?: string;
  skillName: string;
  count?: number;
};

export type SkillGapReportDTO = {
  skillName: string;
  demandCount: number;
  providerCount: number;
  gap: number; // demand - provider
};

export type CollabStatsDTO = {
  totalPosts: number;
  totalApplicants: number;
  completedCollaborations: number;
};

export type AdminRegisterRequest = {
  username: string;
  email: string;
  password: string;
};
