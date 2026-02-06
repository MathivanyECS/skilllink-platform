import { createContext, useState, useEffect, ReactNode } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decode token or fetch user profile
      // For now, we'll try to fetch the profile or decode if you have a decoder
      // Since we don't have the decode logic here, let's fetch /auth/me or just set a dummy user if backend is not available
      // But we have api service. Let's try to fetch user.
      import("../services/api").then(apiModule => {
        apiModule.default.get("/auth/me")
          .then(res => setUser(res.data))
          .catch(() => {
            localStorage.removeItem("token");
            setUser(null);
          })
          .finally(() => setLoading(false));
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
