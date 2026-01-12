import api from './api';

// =========================
// TYPES (based on backend DTOs and responses)
// =========================

export interface CreateFeedbackDto {
  rating: number;
  comment?: string;
}

export interface Feedback {
  id_feedback: number;
  user_id: number;
  event_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  events?: {
    id_event: number;
    title: string;
    date_start: string;
  };
  users?: {
    id_user: number;
    first_name: string | null;
    last_name: string | null;
  };
}

export interface FeedbackSummary {
  event_id: number;
  avgRating: number;
  ratingsCount: number;
}

export interface OrganizerFeedbackStats {
  eventId: number;
  totalRegistered: number;
  feedbackCount: number;
  avgRating: number;
  engagementRate: number;
  ratingDistribution: Array<{
    rating: number;
    _count: { rating: number };
  }>;
}

// =========================
// FEEDBACK SERVICE
// =========================

export const feedbackService = {
  // =========================
  // STUDENT ENDPOINTS
  // =========================

  // POST /feedback/events/:eventId
  async submitFeedback(eventId: number, data: CreateFeedbackDto): Promise<Feedback> {
    const response = await api.post<Feedback>(`/feedback/events/${eventId}`, data);
    return response.data;
  },

  // GET /feedback/me
  async getMyFeedback(): Promise<Feedback[]> {
    const response = await api.get<Feedback[]>('/feedback/me');
    return response.data;
  },

  // =========================
  // PUBLIC ENDPOINTS
  // =========================

  // GET /feedback/events/:eventId
  async getEventFeedback(eventId: number): Promise<Feedback[]> {
    const response = await api.get<Feedback[]>(`/feedback/events/${eventId}`);
    return response.data;
  },

  // GET /feedback/events/:eventId/summary
  async getEventRatingSummary(eventId: number): Promise<FeedbackSummary> {
    const response = await api.get<FeedbackSummary>(`/feedback/events/${eventId}/summary`);
    return response.data;
  },

  // =========================
  // ORGANIZER ENDPOINTS
  // =========================

  // GET /organizer/events/:eventId/feedback/stats
  async getOrganizerEventFeedbackStats(eventId: number): Promise<OrganizerFeedbackStats> {
    const response = await api.get<OrganizerFeedbackStats>(`/organizer/events/${eventId}/feedback/stats`);
    return response.data;
  },

  // GET /organizer/events/:eventId/feedback
  async getOrganizerEventFeedback(eventId: number): Promise<Feedback[]> {
    const response = await api.get<Feedback[]>(`/organizer/events/${eventId}/feedback`);
    return response.data;
  },
};

export default feedbackService;
