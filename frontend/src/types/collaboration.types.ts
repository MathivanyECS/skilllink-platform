/**
 * Collaboration Module Type Definitions
 * 
 * These types match the backend DTOs and models for the Collaboration module.
 * Used throughout the collaboration components and services.
 */

// Application status enum matching backend
export enum ApplicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED"
}

// Post category enum matching backend
export enum PostCategory {
  PROJECT = "PROJECT",
  COMPETITION = "COMPETITION",
  EVENT = "EVENT"
}

// Post status enum matching backend
export enum PostStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  FILLED = "FILLED"
}

/**
 * CollaborationPost - Main post entity
 * Represents a collaboration opportunity (project, competition, or event)
 */
export interface CollaborationPost {
  id: string;
  title: string;
  description: string;
  category: string; // PROJECT, COMPETITION, EVENT
  createdBy: string; // userId of creator
  duration: string; // e.g., "2 weeks" or ISO date string
  status: string; // OPEN, CLOSED, FILLED
  requiredSkills: string[];
  createdAt: string; // ISO date string
  applicants?: string[]; // List of applicant IDs
}

/**
 * CollaborationApplication - Application entity
 * Represents a user's application to join a collaboration post
 */
export interface CollaborationApplication {
  id: string;
  postId: string;
  applicantId: string; // userId of applicant
  message?: string; // Optional applicant message
  status: ApplicationStatus;
  appliedAt: string; // ISO date string
  respondedAt?: string; // ISO date string (when owner responded)
}

/**
 * CollabPostDTO - DTO for creating/updating a post
 * Used in POST /api/collaborations and PUT requests
 */
export interface CollabPostDTO {
  title: string;
  description: string;
  category: PostCategory | string;
  duration: string;
  requiredSkills: string[];
}

/**
 * CollabApplicationDTO - DTO for applying to a post
 * Used in POST /api/collaborations/{postId}/apply
 */
export interface CollabApplicationDTO {
  message?: string;
}

/**
 * Extended application with user info (for owner view)
 * Used when displaying applications to post owner
 */
export interface ApplicationWithUser extends CollaborationApplication {
  applicantName?: string;
  applicantEmail?: string;
  applicantProfile?: {
    fullName?: string;
    department?: string;
    yearOfStudy?: number;
    profileImageUrl?: string;
  };
}
