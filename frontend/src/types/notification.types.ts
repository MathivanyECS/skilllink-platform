export interface Notification {
    id: string;
    recipientId: string;
    message: string;
    isRead: boolean;
    type?: string;
    createdAt?: string; // LocalDateTime string or number
}
