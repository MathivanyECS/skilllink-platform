export interface User {
  id: string;
  email: string;
  fullName: string;
  studentId: string;
  role: 'STUDENT' | 'ADMIN';
  isProfileCompleted: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  studentId: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}