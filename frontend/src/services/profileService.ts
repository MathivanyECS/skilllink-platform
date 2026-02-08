import api from "./api";

export const getAllProfiles = async () => {
  const res = await api.get("/profiles");
  return res.data;
};

export const getProfileById = async (userId: string) => {
  const res = await api.get(`/profiles/${userId}`);
  return res.data;
};
