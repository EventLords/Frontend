// Student Types and Interfaces

export interface StudentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  year: number;
  avatar?: string;
}

export interface StudentEvent {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  image: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  maxParticipants: number;
  currentParticipants: number;
  faculty: string;
  tags: string[];
  agenda?: AgendaItem[];
  isEnrolled?: boolean;
  enrollmentDate?: string;
}

export type EventCategory = 
  | 'workshop'
  | 'conferinta'
  | 'hackathon'
  | 'seminar'
  | 'targ'
  | 'competitie'
  | 'training'
  | 'networking'
  | 'altele';

export interface AgendaItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface EventFilters {
  search: string;
  category: EventCategory | 'all';
  period: 'all' | 'today' | 'this_week' | 'this_month' | 'upcoming';
  location: string;
  faculty: string;
}

export interface Enrollment {
  id: string;
  eventId: string;
  studentId: string;
  enrollmentDate: string;
  qrCode: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  event?: StudentEvent;
}

export interface StudentNotification {
  id: string;
  type: 'enrollment_confirmed' | 'event_reminder' | 'event_update' | 'event_cancelled';
  title: string;
  message: string;
  eventId?: string;
  eventName?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: StudentEvent[];
}

export interface StudentDashboardStats {
  enrolledEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalHours: number;
}

// Filter options
export const categoryOptions: { value: EventCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Toate categoriile' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conferinta', label: 'Conferință' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'targ', label: 'Târg' },
  { value: 'competitie', label: 'Competiție' },
  { value: 'training', label: 'Training' },
  { value: 'networking', label: 'Networking' },
  { value: 'altele', label: 'Altele' },
];

export const periodOptions: { value: EventFilters['period']; label: string }[] = [
  { value: 'all', label: 'Oricând' },
  { value: 'today', label: 'Astăzi' },
  { value: 'this_week', label: 'Săptămâna aceasta' },
  { value: 'this_month', label: 'Luna aceasta' },
  { value: 'upcoming', label: 'Viitoare' },
];

export const locationOptions = [
  'Toate locațiile',
  'Campus Central',
  'Campus Nord',
  'Aula Magna',
  'Biblioteca Centrală',
  'Online',
];
