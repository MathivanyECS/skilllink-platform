export interface SessionBoard {
    id: string;
    sessionId: string;
    learnerId: string;
    teacherId: string;
    meetingDateTime?: string | number[]; // LocalDateTime string or array
    meetingLocation?: string;
    progressNotes?: string;
    lastMessageAt?: string; // LocalDateTime string
    createdAt?: string;
    updatedAt?: string;
}

export interface Message {
    id: string;
    sessionBoardId: string;
    senderId: string;
    senderName: string;
    content: string;
    messageType: "TEXT" | "MEETING_SCHEDULE" | "PROGRESS_UPDATE" | string;
    isRead: boolean;
    timestamp: string | number[]; // LocalDateTime string or array
}

export interface SendMessageRequest {
    sessionBoardId: string;
    content: string;
    messageType?: string;
}

export interface CreateSessionBoardRequest {
    requestId: string;
    seekerId: string;
    providerId: string;
    skillName?: string;
}
