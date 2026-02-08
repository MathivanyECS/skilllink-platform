
// Verified
export interface CollaborationPost {
    id: string;
    userId: string; // The backend uses userId, mapped to createdBy in frontend logic if needed
    createdBy: string; // Helper for frontend if backend sends it, or mapped
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
    duration: string;
    status: "OPEN" | "CLOSED" | "FILLED";
    applicants: string[]; // List of user IDs who applied
    createdAt: string;
    updatedAt: string;
}

export interface CollaborationApplication {
    id: string;
    postId: string;
    applicantId: string;
    applicantName: string;
    applicantEmail?: string;
    message: string;
    contactInfo: string; // portfolio or other link
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    appliedAt: string;
}

export interface CreatePostDTO {
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
    duration: string;
}

export interface CreateApplicationDTO {
    message: string;
    contactInfo: string;
}