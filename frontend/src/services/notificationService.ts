import api from "./api";
import { Notification } from "../types/notification.types";

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
    const res = await api.get(`/notifications/user/${userId}`);
    return res.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
};
