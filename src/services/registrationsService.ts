import api from './api';

// =========================
// TYPES (based on backend responses)
// =========================

export interface Registration {
  id_registration: number;
  user_id: number;
  event_id: number;
  qr_token: string;
  checked_in: boolean;
  created_at: string;
  events?: {
    id_event: number;
    title: string;
    description: string;
    date_start: string;
    deadline: string;
    location: string;
    duration: string | null;
    max_participants: number;
    status: string;
  };
}

export interface Participant {
  id_registration: number;
  user_id: number;
  event_id: number;
  qr_token: string;
  checked_in: boolean;
  created_at: string;
  users: {
    id_user: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    faculty_id: number | null;
  };
}

export interface ParticipantsResponse {
  count: number;
  participants: Participant[];
}

export interface EventParticipationStats {
  eventId: number;
  totalRegistered: number;
  totalCheckedIn: number;
  totalAbsent: number;
}

// =========================
// REGISTRATIONS SERVICE
// =========================

export const registrationsService = {
  // =========================
  // STUDENT ENDPOINTS
  // =========================

  // POST /registrations/events/:id
  async registerForEvent(eventId: number): Promise<Registration> {
    const response = await api.post<Registration>(`/registrations/events/${eventId}`);
    return response.data;
  },

  // DELETE /registrations/events/:id
  async unregisterFromEvent(eventId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/registrations/events/${eventId}`);
    return response.data;
  },

  // GET /registrations/myevents
  async getMyRegistrations(): Promise<Registration[]> {
    const response = await api.get<Registration[]>('/registrations/myevents');
    return response.data;
  },

  // =========================
  // ORGANIZER ENDPOINTS
  // =========================

  // GET /registrations/events/:id/participants
  async getParticipants(
    eventId: number,
    status?: 'all' | 'checked-in' | 'absent'
  ): Promise<ParticipantsResponse> {
    const params = status ? `?status=${status}` : '';
    const response = await api.get<ParticipantsResponse>(
      `/registrations/events/${eventId}/participants${params}`
    );
    return response.data;
  },

  // PATCH /registrations/events/:id/check-in
  async checkInParticipant(
    eventId: number,
    qrToken: string
  ): Promise<{ message: string; registrationId: number }> {
    const response = await api.patch<{ message: string; registrationId: number }>(
      `/registrations/events/${eventId}/check-in`,
      { qr_token: qrToken }
    );
    return response.data;
  },

  // GET /registrations/events/:id/participants/export
  async exportParticipantsCsv(eventId: number): Promise<Blob> {
    const response = await api.get(`/registrations/events/${eventId}/participants/export`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // GET /registrations/events/:id/stats
  async getEventParticipationStats(eventId: number): Promise<EventParticipationStats> {
    const response = await api.get<EventParticipationStats>(
      `/registrations/events/${eventId}/stats`
    );
    return response.data;
  },

  // Helper: Download CSV
  downloadCsv(blob: Blob, eventId: number): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participants_event_${eventId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default registrationsService;
