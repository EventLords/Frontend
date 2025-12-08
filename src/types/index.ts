// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  category: EventCategory;
  organizer: Organizer;
  maxParticipants: number;
  currentParticipants: number;
  imageUrl?: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 
  | 'conference'
  | 'workshop'
  | 'seminar'
  | 'cultural'
  | 'sports'
  | 'social'
  | 'academic'
  | 'other';

export type EventStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed';

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  faculty?: string;
  profileImage?: string;
  createdAt: string;
}

export type UserRole = 'student' | 'organizer' | 'admin';

// Organizer Types
export interface Organizer {
  id: string;
  userId: string;
  organizationName: string;
  description?: string;
  verified: boolean;
  user: User;
}

// Account Validation Request
export interface AccountValidationRequest {
  id: string;
  user: User;
  requestedRole: UserRole;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
  createdAt: string;
}

// Event Organization Request
export interface EventOrganizationRequest {
  id: string;
  event: Event;
  organizer: Organizer;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// Participation
export interface Participation {
  id: string;
  userId: string;
  eventId: string;
  status: 'registered' | 'attended' | 'cancelled';
  qrCode?: string;
  registeredAt: string;
}

// Statistics
export interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalParticipations: number;
  pendingRequests: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  faculty?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Re-export organizer types
export * from './organizer';

// Re-export student types
export * from './student';
