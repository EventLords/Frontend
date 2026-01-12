import { StudentEvent, EventFilters } from "../../../types/student";
import { mapApiEventToStudentEvent } from "./event.mapper";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface FeedbackItem {
  id_feedback: number;
  rating: number;
  comment: string | null;
  created_at: string;
  users?: {
    id_user: number;
    first_name: string;
    last_name: string;
  };
}

const getToken = (): string | null => {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token")
  );
};

const getDateRange = (period: string) => {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);

  if (period === "today") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "this_week") {
    const day = today.getDay() || 7;
    start.setDate(today.getDate() - (day - 1));
    start.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else if (period === "this_month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
  }
  return { start: start.toISOString(), end: end.toISOString() };
};

export const studentEventsService = {
  // =========================
  // LISTARE & UTILS FILTRE
  // =========================
  async getAllEvents(
    filters: Partial<EventFilters> = {}
  ): Promise<StudentEvent[]> {
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.faculty) params.append("facultyId", filters.faculty);
    if (filters.location && filters.location !== "all")
      params.append("location", filters.location);
    if (filters.category && filters.category !== "all")
      params.append("typeId", filters.category);

    if (filters.period && filters.period !== "all") {
      if (filters.period === "upcoming") {
        params.append("dateFrom", new Date().toISOString());
      } else {
        const { start, end } = getDateRange(filters.period);
        params.append("dateFrom", start);
        params.append("dateTo", end);
      }
    }

    const response = await fetch(
      `${API_BASE_URL}/events?${params.toString()}`,
      { headers }
    );
    if (!response.ok) throw new Error("Failed to fetch events");
    const events = await response.json();
    return Array.isArray(events) ? events.map(mapApiEventToStudentEvent) : [];
  },

  // ✅ REZOLVARE EROARE: Metoda restaurată pentru EventFilters.tsx
  async getUniqueLocations(): Promise<string[]> {
    const events = await this.getAllEvents();
    const locations = new Set(
      events.map((e) => e.location?.trim()).filter(Boolean)
    );
    return Array.from(locations);
  },

  // =========================
  // DETALII EVENIMENT
  // =========================
  async getEventById(id: string): Promise<StudentEvent> {
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/events/${id}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch event");
    const rawEvent = await response.json();
    const mappedEvent = mapApiEventToStudentEvent(rawEvent);
    return { ...mappedEvent, files: rawEvent.files || [] };
  },

  // =========================
  // FEEDBACK
  // =========================
  async submitFeedback(data: {
    event_id: number;
    rating: number;
    comment?: string;
  }) {
    const token = getToken();
    if (!token) throw new Error("Sesiune expirată.");
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Eroare la trimiterea feedback-ului.");
    return response.json();
  },

  async getEventFeedback(eventId: number): Promise<FeedbackItem[]> {
    const token = getToken();
    const response = await fetch(
      `${API_BASE_URL}/organizer/events/${eventId}/feedback`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Nu s-a putut încărca feedback-ul");
    return response.json();
  },

  async getMyFeedback() {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/feedback/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? response.json() : [];
  },

  // =========================
  // FAVORITE & STATS
  // =========================
  async toggleFavorite(eventId: string): Promise<{ favorited: boolean }> {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async getFavoriteEvents(): Promise<StudentEvent[]> {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/favorites/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const events = await response.json();
    return Array.isArray(events) ? events.map(mapApiEventToStudentEvent) : [];
  },

  async getDashboardStats() {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/registrations/me/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? response.json() : null;
  },
};
