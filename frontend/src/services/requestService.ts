import api from "./api";

export interface SkillRequest {
    id: string;
    seekerId: string;
    providerId: string;
    skillName: string;
    note: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
    createdAt: string;
    updatedAt: string;
}

export const getRequestById = async (requestId: string): Promise<SkillRequest> => {
    const response = await api.get<SkillRequest>(`/requests/${requestId}`);
    return response.data;
};

export const updateRequestStatus = async (requestId: string, status: string): Promise<SkillRequest> => {
    const response = await api.put<SkillRequest>(`/requests/${requestId}/status`, null, {
        params: { status }
    });
    return response.data;
};
