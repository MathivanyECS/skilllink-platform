// Verified against ProfileDTO.java
export interface SkillToTeach {
    skillName: string;
    proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    yearsOfExperience: number;
}

export interface SocialLinks {
    linkedin?: string;
    github?: string;
    portfolio?: string;
}

export interface ProfileStatistics {
    totalStudentsTaught: number;
    totalSessionsCompleted: number;
    averageRating: number;
    totalReviewsReceived: number;
}

export interface Profile {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    studentId?: string;
    profilePicture?: string;
    department?: string;
    yearOfStudy?: number;
    bio?: string;
    phoneNumber?: string;
    skillsToTeach: SkillToTeach[];
    skillsToLearn: string[];
    statistics: ProfileStatistics;
    socialLinks?: SocialLinks;
    createdAt: string;
}
