export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  validationErrors?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}