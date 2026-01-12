import api from './api';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User,
  ApiResponse 
} from '../types';

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    
    if (response.data.data.token) {
      localStorage.setItem('accessToken', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data.data;
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    
    if (response.data.data.token) {
      localStorage.setItem('accessToken', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Refresh token
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh', { refreshToken });
    
    const { token } = response.data.data;
    localStorage.setItem('accessToken', token);
    
    return token;
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword });
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },
};

export default authService;
