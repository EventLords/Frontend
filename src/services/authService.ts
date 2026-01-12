import api from './api';
import { 
  LoginDto,
  RegisterStudentDto,
  RegisterOrganizerDto,
  LoginResponse,
  RegisterResponse,
} from '../types/auth';

// =========================
// AUTH SERVICE
// Based on backend: POST /auth/login, POST /auth/register/student, POST /auth/register/organizer
// =========================

export const authService = {
  // POST /auth/login
  async login(credentials: LoginDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Backend returns: { message, token, user }
    const { token } = response.data;
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    
    return response.data;
  },

  // POST /auth/register/student
  async registerStudent(data: RegisterStudentDto): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register/student', data);
    // Note: Backend does NOT return token on register, only user data
    // User must login after registration
    return response.data;
  },

  // POST /auth/register/organizer
  async registerOrganizer(data: RegisterOrganizerDto): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register/organizer', data);
    // Note: Backend does NOT return token on register, only user data
    // Organizer must wait for admin approval before login
    return response.data;
  },

  // Logout (client-side only)
  logout(): void {
    localStorage.removeItem('accessToken');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  // Get user ID from token (decoded)
  getUserId(): number | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null; // Backend uses 'sub' for user ID
    } catch {
      return null;
    }
  },

  // Get stored user role from token (decoded)
  getUserRole(): 'STUDENT' | 'ORGANIZER' | 'ADMIN' | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  },

  // Check if user is approved (from token)
  isApproved(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isApproved === true;
    } catch {
      return false;
    }
  },
};

export default authService;
