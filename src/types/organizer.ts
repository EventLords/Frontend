// Organizer Types

export interface OrganizerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface Event {
  id: string;
  name: string;
  type: string;
  description: string;
  faculty: string;
  date: string;
  deadline: string;
  location: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'active' | 'inactive' | 'draft';
  materials?: number;
  createdAt: string;
  updatedAt: string;
  organizerId: string;
}

export interface CreateEventData {
  name: string;
  type: string;
  description: string;
  faculty: string;
  date: string;
  deadline: string;
  location: string;
  duration: string;
  maxParticipants: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'active' | 'inactive' | 'draft';
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  registeredAt: string;
  confirmed: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  isNew: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface DashboardStats {
  activeEvents: number;
  totalParticipants: number;
  uploadedMaterials: number;
}
