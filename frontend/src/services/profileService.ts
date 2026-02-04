import api from "./api";

export const getAllProfiles = async () => {
  const res = await api.get("/profiles");
  return res.data;
};
