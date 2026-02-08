import { createContext, useState, ReactNode, useContext } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ ADD THIS (no logic changed)
export const useAuth = () => {
  return useContext(AuthContext);
};
