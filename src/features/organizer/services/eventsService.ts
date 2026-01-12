import { authHeaders, forceLogoutAndRedirect, getAuthToken } from "./auth";
import type {
  Event,
  DashboardStats,
  UpdateEventData,
} from "../../../types/organizer";

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:3001/api`;
};

const API_BASE_URL = getBaseUrl();

/* =========================
   BACKEND TYPES & HELPERS
========================= */
type ApiEvent = {
  id_event: number;
  name: string;
  title?: string;
  type: string;
  description: string;
  faculty: string;
  date: string;
  date_start?: string;
  deadline: string;
  location: string;
  duration: string;
  max_participants: number;
  current_participants: number;
  registrations?: any[];
  status: "active" | "inactive" | "draft" | "pending" | "rejected";
  created_at: string;
  updated_at: string;
  organizer_id: number;
  files?: any[];
  // ✅ IMPORTANT: Adăugăm ID-urile aici pentru TypeScript
  faculty_id?: number;
  type_id?: number;
};

export interface ApiRegistration {
  id_registration: number;
  qr_token: string;
  checked_in: boolean;
  users: {
    id_user: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface FeedbackStats {
  eventId: number;
  totalRegistered: number;
  feedbackCount: number;
  avgRating: number;
  engagementRate: number;
  ratingDistribution: { rating: number; _count: { rating: number } }[];
}

export interface FeedbackItem {
  id_feedback: number;
  rating: number;
  comment: string | null;
  created_at: string;
  users: {
    id_user: number;
    first_name: string;
    last_name: string;
  };
}

async function handleAuth(res: Response) {
  if (res.status === 401) {
    forceLogoutAndRedirect();
    throw new Error("401 Unauthorized");
  }
}

const requireToken = () => {
  const token = getAuthToken();
  if (!token) forceLogoutAndRedirect();
  return token;
};

const mapApiEventToEvent = (e: ApiEvent): Event => ({
  id: String(e.id_event),
  name: e.title || e.name || "",
  type: e.type,
  description: e.description,
  faculty: e.faculty,
  date: e.date_start || e.date || "",
  deadline: e.deadline,
  location: e.location,
  duration: e.duration,
  maxParticipants: e.max_participants,
  currentParticipants:
    e.current_participants || (e.registrations ? e.registrations.length : 0),
  status: e.status as Event["status"],
  createdAt: e.created_at,
  updatedAt: e.updated_at,
  organizerId: String(e.organizer_id),
});

/* =========================
   SERVICE METHODS
========================= */
const eventsService = {
  async getOrganizerDashboard(): Promise<{
    stats: DashboardStats;
    events: Event[];
  }> {
    requireToken();
    const res = await fetch(`${API_BASE_URL}/events/organizer/dashboard`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    if (!res.ok) throw new Error("Dashboard error");
    const data = await res.json();
    return {
      stats: data.stats,
      events: (data.events as ApiEvent[]).map(mapApiEventToEvent),
    };
  },

  // ✅ AICI AM MODIFICAT: Returnăm și ID-urile brute
  async getEventById(
    eventId: number
  ): Promise<Event & { files?: any[]; faculty_id?: number; type_id?: number }> {
    requireToken();
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/organizer`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    if (!res.ok) throw new Error("Event not found");
    const data: ApiEvent = await res.json();

    return {
      ...mapApiEventToEvent(data),
      files: data.files || [],
      // ✅ Pasăm ID-urile critice mai departe către pagină
      faculty_id: data.faculty_id,
      type_id: data.type_id,
    };
  },

  async updateEvent(eventId: number, data: UpdateEventData): Promise<void> {
    requireToken();
    const payload = {
      title: data.name,
      description: data.description,
      location: data.location,
      duration: data.duration,
      date_start: data.date,
      deadline: data.deadline,
      max_participants: Number(data.maxParticipants),
      status: data.status,
      faculty_id: Number(data.faculty_id),
      type_id: Number(data.type_id),
    };

    const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    await handleAuth(res);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Update failed");
    }
  },

  async getParticipants(eventId: number): Promise<ApiRegistration[]> {
    requireToken();
    const res = await fetch(
      `${API_BASE_URL}/registrations/events/${eventId}/participants`,
      { headers: authHeaders() }
    );
    await handleAuth(res);
    if (!res.ok) throw new Error("Participants error");
    const data = await res.json();
    return data.participants;
  },

  async checkInParticipant(
    eventId: number,
    qrToken: string
  ): Promise<{ message: string; registrationId: number }> {
    requireToken();

    const res = await fetch(
      `${API_BASE_URL}/registrations/events/${eventId}/check-in`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ qr_token: qrToken }), // ✅ CHEIA CORECTĂ
      }
    );

    await handleAuth(res);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Check-in failed");
    }

    // 🔥 FOARTE IMPORTANT
    return res.json();
  },

  async exportParticipantsToCSV(eventId: number): Promise<Blob> {
    const token = getAuthToken();
    if (!token) forceLogoutAndRedirect();
    const res = await fetch(
      `${API_BASE_URL}/registrations/events/${eventId}/participants/export`,
      { headers: authHeaders() }
    );
    await handleAuth(res);
    if (!res.ok) throw new Error("Export failed");
    return res.blob();
  },

  async getFeedbackStats(eventId: number): Promise<FeedbackStats> {
    requireToken();
    const res = await fetch(
      `${API_BASE_URL}/organizer/events/${eventId}/feedback/stats`,
      { headers: authHeaders() }
    );
    await handleAuth(res);
    if (!res.ok) throw new Error("Failed to load feedback stats");
    return res.json();
  },

  async getFeedbackList(eventId: number): Promise<FeedbackItem[]> {
    requireToken();
    const res = await fetch(
      `${API_BASE_URL}/organizer/events/${eventId}/feedback`,
      { headers: authHeaders() }
    );
    await handleAuth(res);
    if (!res.ok) throw new Error("Failed to load feedback list");
    return res.json();
  },

  async createEvent(payload: any) {
    requireToken();
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    await handleAuth(res);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Create event failed");
    }
    return res.json();
  },

  async submitEvent(eventId: number) {
    requireToken();
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/submit`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    await handleAuth(res);
    if (!res.ok) throw new Error("Submit failed");
    return res.json();
  },

  async deleteEvent(eventId: number): Promise<void> {
    requireToken();
    const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handleAuth(res);
    if (!res.ok) throw new Error("Delete failed");
  },

  async archiveEvent(eventId: number) {
    requireToken();
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/archive`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    await handleAuth(res);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Archiving failed");
    }
    return res.json();
  },

  async uploadFile(eventId: number, formData: FormData) {
    const token = requireToken();
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    await handleAuth(res);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Upload failed");
    }
    return res.json();
  },

  async setCoverImage(eventId: number, fileId: number) {
    requireToken();
    const res = await fetch(
      `${API_BASE_URL}/events/${eventId}/files/${fileId}/cover`,
      {
        method: "PATCH",
        headers: authHeaders(),
      }
    );
    await handleAuth(res);
    if (!res.ok) throw new Error("Set cover failed");
    return res.json();
  },

  async deleteFile(eventId: number, fileId: number) {
    requireToken();
    const res = await fetch(
      `${API_BASE_URL}/events/${eventId}/files/${fileId}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      }
    );
    await handleAuth(res);
    if (!res.ok) throw new Error("Delete file failed");
    return res.json();
  },

  async getEventFiles(eventId: number) {
    requireToken();
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/files`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    if (!res.ok) throw new Error("Failed to fetch files");
    return res.json();
  },

  async getFaculties() {
    const res = await fetch(`${API_BASE_URL}/faculties`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch faculties");
    return res.json();
  },

  async getEventTypes() {
    return [
      { id: 1, name: "Conferință" },
      { id: 2, name: "Workshop" },
      { id: 3, name: "Social" },
      { id: 4, name: "Academic" },
      { id: 5, name: "Carieră" },
      { id: 6, name: "Sportiv" },
      { id: 7, name: "Voluntariat" },
      { id: 8, name: "Cultural" },
    ];
  },
  // În services/eventsService.ts (sau feedbackService.ts dacă ai unul separat)

  async getEventFeedback(eventId: number): Promise<FeedbackItem[]> {
    requireToken();
    const res = await fetch(`${API_BASE_URL}/organizer/events/${eventId}/feedback`, {
      headers: authHeaders(),
    });
    
    await handleAuth(res);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch feedback");
    }
    
    return res.json();
  },
};

export default eventsService;
