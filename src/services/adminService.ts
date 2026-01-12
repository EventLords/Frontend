import api from "./api";
// =========================
// TYPES (based on backend DTOs and responses)
// =========================

export interface PendingEvent {
  id_event: number;
  title: string;
  description: string;
  date_start: string;
  deadline: string;
  location: string;
  max_participants: number;
  status: string;
  organizer_id: number;
  faculty_id: number;
  type_id: number;
  created_at: string;
}

export interface PendingOrganizer {
  id_user: number;
  email: string;
  organization_name: string | null;
  organization_type: string | null;
  created_at: string;
}

export interface AdminDashboard {
  pendingEvents: number;
  pendingOrganizers: number;
  unreadNotifications: number;
}

export interface EventDetails {
  id_event: number;
  title: string;
  description: string;
  date_start: string;
  deadline: string;
  location: string;
  duration: string | null;
  max_participants: number;
  status: string;
  rejection_reason: string | null;
  isArchived: boolean;
  organizer_id: number;
  faculty_id: number;
  type_id: number;
  created_at: string;
  updated_at: string;
  users: {
    id_user: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    organization_name: string | null;
    organization_type: string | null;
  };
  event_types: { id_type: number; name: string } | null;
  faculties: { id_faculty: number; name: string } | null;
  files: Array<{ id_file: number; file_path: string; is_cover: boolean }>;
  registrations: Array<{ id_registration: number; user_id: number }>;
  feedback: Array<{
    id_feedback: number;
    rating: number;
    comment: string;
    users: { first_name: string; last_name: string };
  }>;
}

// =========================
// ADMIN REPORTS TYPES
// =========================

export interface EventsPerMonthResponse {
  from: string | null;
  to: string | null;
  totalEvents: number;
  data: Array<{ month: string; count: number }>;
}

export interface ParticipationStatsResponse {
  from: string | null;
  to: string | null;
  totalEvents: number;
  totalRegistrations: number;
  totalCheckedIn: number;
  avgRegistrationsPerEvent: number;
  avgCheckedInPerEvent: number;
  attendanceRate: number;
}

export interface TopEventsResponse {
  from: string | null;
  to: string | null;
  sort: string;
  limit: number;
  data: Array<{
    id_event: number;
    title: string;
    date_start: string;
    organizer: string | null;
    registrationsCount: number;
    checkedInCount: number;
  }>;
}

// =========================
// ADMIN SERVICE
// =========================

export const adminService = {
  // =========================
  // EVENTS
  // =========================

  // GET /admin/events/pending
  async getPendingEvents(): Promise<PendingEvent[]> {
    const response = await api.get<PendingEvent[]>("/admin/events/pending");
    return response.data;
  },

  // PATCH /admin/events/:id/approve
  async approveEvent(eventId: number): Promise<PendingEvent> {
    const response = await api.patch<PendingEvent>(
      `/admin/events/${eventId}/approve`
    );
    return response.data;
  },

  // PATCH /admin/events/:id/reject
  async rejectEvent(eventId: number, reason: string): Promise<PendingEvent> {
    const response = await api.patch<PendingEvent>(
      `/admin/events/${eventId}/reject`,
      { reason }
    );
    return response.data;
  },

  // GET /admin/events/:id
  async getEventDetails(eventId: number): Promise<EventDetails> {
    const response = await api.get<EventDetails>(`/admin/events/${eventId}`);
    return response.data;
  },

  // =========================
  // ORGANIZERS
  // =========================

  // GET /admin/organizers/pending
  async getPendingOrganizers(): Promise<PendingOrganizer[]> {
    const response = await api.get<PendingOrganizer[]>(
      "/admin/organizers/pending"
    );
    return response.data;
  },

  // PATCH /admin/organizers/:id/approve
  async approveOrganizer(userId: number): Promise<any> {
    const response = await api.patch(`/admin/organizers/${userId}/approve`);
    return response.data;
  },

  // PATCH /admin/organizers/:id/reject
  async rejectOrganizer(userId: number, reason: string): Promise<any> {
    const response = await api.patch(`/admin/organizers/${userId}/reject`, {
      reason,
    });
    return response.data;
  },

  // =========================
  // DASHBOARD
  // =========================

  // GET /admin/dashboard
  async getDashboard(): Promise<AdminDashboard> {
    const response = await api.get<AdminDashboard>("/admin/dashboard");
    return response.data;
  },

  // =========================
  // REPORTS
  // =========================

  // GET /admin/reports/events-per-month
  async getEventsPerMonth(
    from?: string,
    to?: string
  ): Promise<EventsPerMonthResponse> {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get<EventsPerMonthResponse>(
      `/admin/reports/events-per-month${query}`
    );
    return response.data;
  },

  // GET /admin/reports/participation
  async getParticipationStats(
    from?: string,
    to?: string
  ): Promise<ParticipationStatsResponse> {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get<ParticipationStatsResponse>(
      `/admin/reports/participation${query}`
    );
    return response.data;
  },

  // GET /admin/reports/top-events
  async getTopEvents(options?: {
    from?: string;
    to?: string;
    limit?: number;
    sort?: "registrations" | "checkedin";
  }): Promise<TopEventsResponse> {
    const params = new URLSearchParams();
    if (options?.from) params.append("from", options.from);
    if (options?.to) params.append("to", options.to);
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.sort) params.append("sort", options.sort);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get<TopEventsResponse>(
      `/admin/reports/top-events${query}`
    );
    return response.data;
  },
};

export default adminService;
