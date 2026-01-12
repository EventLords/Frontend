// ==========================================
// Auth Types - Matching Backend DTOs
// ==========================================

// Login DTO
export interface LoginDto {
  email: string;
  password: string;
}

// Register Student DTO - matches backend exactly
export interface RegisterStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studyCycle: string;
  facultyId: number;
  specializationId: number;
  studyYear?: number;
}

// Register Organizer DTO - matches backend exactly
export interface RegisterOrganizerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  organizationType: string;
  organizationName?: string;
  organizationDescription: string;
}

// User from backend response (matches backend login response)
export interface AuthUser {
  id_user: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'STUDENT' | 'ORGANIZER' | 'ADMIN';
}

// Login response from backend (direct response, no wrapper)
export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

// Register response (student/organizer creation response)
export interface RegisterResponse {
  id_user: number;
  email: string;
  role: 'STUDENT' | 'ORGANIZER';
  first_name: string;
  last_name: string;
  isApproved: boolean;
  created_at: string;
  // Student-specific fields
  faculty_id?: number;
  specialization_id?: number;
  study_cycle?: string;
  study_year?: number;
  // Organizer-specific fields
  phone?: string;
  organization_type?: string;
  organization_name?: string;
  organization_description?: string;
  isRejected?: boolean;
}

// Legacy compatibility (for existing code)
export interface AuthResponseData {
  token: string;
  refreshToken?: string;
  user: AuthUser;
}

// Full API response wrapper (legacy)
export interface ApiAuthResponse {
  data: AuthResponseData;
}

// Form state types for controlled inputs
export interface LoginFormData {
  email: string;
  password: string;
}

export interface StudentRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  facultyId: string;
  specializationId: string;
  studyCycle: string;
  studyYear: string;
}

export interface OrganizerRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  organizationName: string;
  organizationType: string;
  organizationDescription: string;
}
