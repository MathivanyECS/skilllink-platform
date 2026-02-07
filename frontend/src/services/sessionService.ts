import api from "./api";
import { SessionBoard, CreateSessionBoardRequest } from "../types/session.types";

export const createSessionBoard = async (data: CreateSessionBoardRequest): Promise<SessionBoard> => {
    const res = await api.post("/session-boards/create-from-request", data);
    return res.data;
};

export const getSessionBoardById = async (id: string): Promise<SessionBoard> => {
    const res = await api.get(`/session-boards/${id}`);
    return res.data;
};

export const getSessionBoardsByLearner = async (learnerId: string): Promise<SessionBoard[]> => {
    const res = await api.get(`/session-boards/learner/${learnerId}`);
    return res.data;
};

export const getSessionBoardsByTeacher = async (teacherId: string): Promise<SessionBoard[]> => {
    const res = await api.get(`/session-boards/teacher/${teacherId}`);
    return res.data;
};

export const updateMeeting = async (
    id: string,
    meetingDateTime: string,
    meetingLocation: string
): Promise<SessionBoard> => {
    const res = await api.put(`/session-boards/${id}/meeting`, null, {
        params: { meetingDateTime, meetingLocation }
    });
    return res.data;
};

export const updateProgressNotes = async (id: string, progressNotes: string): Promise<SessionBoard> => {
    // Pass as query param or body depending on backend. Controller uses @RequestParam so query param
    const res = await api.put(`/session-boards/${id}/progress-notes`, null, {
        params: { progressNotes }
    });
    return res.data;
};
