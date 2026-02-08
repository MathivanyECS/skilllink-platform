export const APP_NAME = 'SkillLink';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CREATE_PROFILE: '/create-profile',
  DASHBOARD: '/dashboard',
};

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
} as const;