import api from "./api";
import { Message, SendMessageRequest } from "../types/session.types";

export const sendMessage = async (data: SendMessageRequest): Promise<Message> => {
    const res = await api.post("/messages", data);
    return res.data;
};

export const getMessages = async (sessionBoardId: string): Promise<Message[]> => {
    const res = await api.get(`/messages/session/${sessionBoardId}`);
    return res.data;
};

export const markMessagesAsRead = async (sessionBoardId: string): Promise<void> => {
    await api.put(`/messages/session/${sessionBoardId}/read`);
};

export const getUnreadCount = async (sessionBoardId: string): Promise<number> => {
    const res = await api.get(`/messages/session/${sessionBoardId}/unread-count`);
    return res.data;
};
