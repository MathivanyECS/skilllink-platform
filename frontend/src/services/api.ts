import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Use relative path to leverage Vite proxy
});

// ✅ JWT interceptor (correct)
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

export default api;
