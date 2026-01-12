import api from './api';

// =========================
// TYPES (based on backend responses)
// =========================

export interface RecommendedEvent {
  id_event: number;
  title: string;
  description: string;
  date_start: string;
  deadline: string;
  location: string;
  duration: string | null;
  max_participants: number;
  status: string;
  organizer_id: number;
  faculty_id: number | null;
  type_id: number | null;
  created_at: string;
  updated_at: string;
  recommendationScore: number;
  recommendationReason: string;
}

// =========================
// RECOMMENDATIONS SERVICE
// =========================

export const recommendationsService = {
  // GET /recommendations/me
  async getMyRecommendations(): Promise<RecommendedEvent[]> {
    const response = await api.get<RecommendedEvent[]>('/recommendations/me');
    return response.data;
  },
};

export default recommendationsService;
