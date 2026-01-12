import api from './api';

// =========================
// TYPES (based on backend DTOs and responses)
// =========================

export interface CreateEventDto {
  title: string;
  type_id: number;
  faculty_id: number;
  date_start: string;
  deadline: string;
  location: string;
  max_participants: number;
  duration?: string;
  description: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  date_start?: string;
  status?: 'draft' | 'pending' | 'active' | 'inactive' | 'rejected';
  location?: string;
  max_participants?: number;
}

export interface EventFilterDto {
  facultyId?: string;
  typeId?: string;
  organizerId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface Event {
  id_event: number;
  title: string;
  description: string;
  date_start: string;
  deadline: string;
  location: string;
  duration: string | null;
  max_participants: number;
  status: 'draft' | 'pending' | 'active' | 'inactive' | 'rejected';
  rejection_reason: string | null;
  isArchived: boolean;
  organizer_id: number;
  faculty_id: number;
  type_id: number;
  created_at: string;
  updated_at: string;
}

export interface EventWithDetails extends Event {
  users?: {
    first_name: string | null;
    last_name: string | null;
    organization_name: string | null;
  };
  event_types?: { id_type: number; name: string } | null;
  faculties?: { id_faculty: number; name: string } | null;
  files?: Array<{ id_file: number; file_path: string; is_cover: boolean }>;
}

export interface OrganizerEventDetails extends Event {
  registrations: Array<{ id_registration: number; user_id: number; checked_in: boolean }>;
  feedback: Array<{ id_feedback: number; rating: number; comment: string }>;
  files: Array<{ id_file: number; file_path: string; is_cover: boolean }>;
}

// =========================
// EVENTS API SERVICE
// =========================

export const eventsApiService = {
  // =========================
  // ORGANIZER ENDPOINTS
  // =========================

  // POST /events (ORGANIZER)
  async createEvent(data: CreateEventDto): Promise<Event> {
    const response = await api.post<Event>('/events', data);
    return response.data;
  },

  // GET /events/organizer (ORGANIZER)
  async getMyEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events/organizer');
    return response.data;
  },

  // PATCH /events/:id (ORGANIZER)
  async updateEvent(eventId: number, data: UpdateEventDto): Promise<Event> {
    const response = await api.patch<Event>(`/events/${eventId}`, data);
    return response.data;
  },

  // PATCH /events/:id/submit (ORGANIZER)
  async submitEvent(eventId: number): Promise<Event> {
    const response = await api.patch<Event>(`/events/${eventId}/submit`);
    return response.data;
  },

  // PATCH /events/:id/archive (ORGANIZER)
  async archiveEvent(eventId: number): Promise<Event> {
    const response = await api.patch<Event>(`/events/${eventId}/archive`);
    return response.data;
  },

  // DELETE /events/:id (ORGANIZER)
  async deleteEvent(eventId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/events/${eventId}`);
    return response.data;
  },

  // GET /events/organizer/archived (ORGANIZER)
  async getMyArchivedEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events/organizer/archived');
    return response.data;
  },

  // GET /events/:id/organizer (ORGANIZER)
  async getEventByIdOrganizer(eventId: number): Promise<OrganizerEventDetails> {
    const response = await api.get<OrganizerEventDetails>(`/events/${eventId}/organizer`);
    return response.data;
  },

  // =========================
  // PUBLIC ENDPOINTS
  // =========================

  // GET /events (PUBLIC with filters)
  async listActiveEvents(filters?: EventFilterDto): Promise<Event[]> {
    const params = new URLSearchParams();
    if (filters?.facultyId) params.append('facultyId', filters.facultyId);
    if (filters?.typeId) params.append('typeId', filters.typeId);
    if (filters?.organizerId) params.append('organizerId', filters.organizerId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get<Event[]>(`/events${query}`);
    return response.data;
  },

  // GET /events/:id (PUBLIC)
  async getEventById(eventId: number): Promise<EventWithDetails> {
    const response = await api.get<EventWithDetails>(`/events/${eventId}`);
    return response.data;
  },

  // =========================
  // STUDENT ENDPOINTS
  // =========================

  // POST /events/:id/favorite (STUDENT)
  async toggleFavorite(eventId: number): Promise<{ favorited: boolean }> {
    const response = await api.post<{ favorited: boolean }>(`/events/${eventId}/favorite`);
    return response.data;
  },
};

export default eventsApiService;
