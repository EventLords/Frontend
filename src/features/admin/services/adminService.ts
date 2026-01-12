import {
  authHeaders,
  forceLogoutAndRedirect,
  getAuthToken,
} from "../../organizer/services/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const handleAuth = async (res: Response) => {
  if (res.status === 401) {
    forceLogoutAndRedirect();
    throw new Error("Sesiune expirată");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Eroare la comunicarea cu serverul");
  }
  return res;
};

// ================= INTERFEȚE =================

export interface EventsPerMonth {
  from: string | null;
  to: string | null;
  totalEvents: number;
  data: Array<{ month: string; count: number }>;
}

export interface ParticipationStats {
  from: string | null;
  to: string | null;
  totalEvents: number;
  totalRegistrations: number;
  totalCheckedIn: number;
  avgRegistrationsPerEvent: number;
  avgCheckedInPerEvent: number;
  attendanceRate: number;
}

export interface TopEventsData {
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

export interface AdminUser {
  id_user: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: "STUDENT" | "ORGANIZER" | "ADMIN";
  created_at: string;
  organization_name?: string;
  organization_type?: string;
  status: "active" | "pending" | "suspended" | "inactive";
  displayName: string;
  department: string;
}

// ================= SERVICIUL ADMIN =================

const adminService = {
  // --- USERS ---
  getUsers: async (): Promise<AdminUser[]> => {
    const token = getAuthToken();
    if (!token) return [];
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    return res.json();
  },

  // --- EVENTS LISTS ---
  getActiveEvents: async () => {
    const token = getAuthToken();
    if (!token) return [];
    const res = await fetch(`${API_BASE_URL}/admin/events/active`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    return res.json();
  },

  getPendingEvents: async () => {
    const token = getAuthToken();
    if (!token) return [];
    const res = await fetch(`${API_BASE_URL}/admin/events/pending`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    return res.json();
  },

  // ✅ METODĂ NOUĂ: Preia evenimentele respinse
  getRejectedEvents: async () => {
    const token = getAuthToken();
    if (!token) return [];
    const res = await fetch(`${API_BASE_URL}/admin/events/rejected`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    return res.json();
  },

  getEventDetails: async (eventId: string | number) => {
    const token = getAuthToken();
    if (!token) throw new Error("Nu ești autentificat");
    const res = await fetch(`${API_BASE_URL}/events/admin-details/${eventId}`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    return res.json();
  },

  approveEvent: async (eventId: number) => {
    const token = getAuthToken();
    if (!token) throw new Error("Nu ești autentificat");
    const res = await fetch(`${API_BASE_URL}/admin/events/${eventId}/approve`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    await handleAuth(res);
    return res.json();
  },

  rejectEvent: async (eventId: number, reason: string) => {
    const token = getAuthToken();
    if (!token) throw new Error("Nu ești autentificat");
    const res = await fetch(`${API_BASE_URL}/admin/events/${eventId}/reject`, {
      method: "PATCH",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    await handleAuth(res);
    return res.json();
  },

  getPendingOrganizers: async () => {
    const token = getAuthToken();
    if (!token) return [];
    const res = await fetch(`${API_BASE_URL}/admin/organizers/pending`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    return res.json();
  },

  approveOrganizer: async (organizerId: number) => {
    const token = getAuthToken();
    if (!token) throw new Error("Nu ești autentificat");
    const res = await fetch(
      `${API_BASE_URL}/admin/organizers/${organizerId}/approve`,
      { method: "PATCH", headers: authHeaders() }
    );
    await handleAuth(res);
    return res.json();
  },

  rejectOrganizer: async (organizerId: number, reason: string) => {
    const token = getAuthToken();
    if (!token) throw new Error("Nu ești autentificat");
    const res = await fetch(
      `${API_BASE_URL}/admin/organizers/${organizerId}/reject`,
      {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      }
    );
    await handleAuth(res);
    return res.json();
  },

  getEventsPerMonth: async (
    from?: string,
    to?: string
  ): Promise<EventsPerMonth> => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const res = await fetch(
      `${API_BASE_URL}/admin/reports/events-per-month?${params.toString()}`,
      {
        headers: authHeaders(),
      }
    );
    await handleAuth(res);
    return res.json();
  },

  getParticipationStats: async (
    from?: string,
    to?: string
  ): Promise<ParticipationStats> => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const res = await fetch(
      `${API_BASE_URL}/admin/reports/participation?${params.toString()}`,
      {
        headers: authHeaders(),
      }
    );
    await handleAuth(res);
    return res.json();
  },

  getTopEvents: async (
    sort: "registrations" | "checkedin" = "registrations",
    limit = 5,
    from?: string,
    to?: string
  ): Promise<TopEventsData> => {
    const params = new URLSearchParams();
    params.append("sort", sort);
    params.append("limit", limit.toString());
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const res = await fetch(
      `${API_BASE_URL}/admin/reports/top-events?${params.toString()}`,
      {
        headers: authHeaders(),
      }
    );
    await handleAuth(res);
    return res.json();
  },

  getActivityStats: async () => {
    const token = getAuthToken();
    if (!token) return { totalProcessedToday: 0, avgResponseTime: "N/A" };
    const res = await fetch(`${API_BASE_URL}/admin/activity-stats`, {
      headers: authHeaders(),
    });
    await handleAuth(res);
    return res.json();
  },
};

export default adminService;
