// src/features/organizer/services/notificationsService.ts
import type { Notification } from "../../../types/organizer";
import { authHeaders, forceLogoutAndRedirect, getAuthToken } from "./auth";

// Asigură-te că URL-ul este corect configurat
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Backend shape (din Prisma)
 */
type BackendNotification = {
  id_notification: number;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read_at: string | null;
};

function mapType(type: string): Notification["type"] {
  const t = (type || "").toLowerCase();
  if (t.includes("approved") || t.includes("accepted")) return "success";
  if (t.includes("deadline")) return "warning";
  if (t.includes("rejected") || t.includes("error")) return "error";
  return "info";
}

function mapNotification(n: BackendNotification): Notification {
  return {
    id: String(n.id_notification),
    title: n.title,
    description: n.message,
    date: n.created_at,
    isNew: n.read_at === null,
    type: mapType(n.type),
  };
}

async function handleAuth(res: Response) {
  if (res.status === 401) {
    // token lipsă/expirat → redirect curat
    forceLogoutAndRedirect();
    throw new Error("401 Unauthorized");
  }
}

const notificationsService = {
  async getNotifications(): Promise<Notification[]> {
    const token = getAuthToken();
    if (!token) {
      forceLogoutAndRedirect();
      return [];
    }

    const res = await fetch(`${API_BASE_URL}/notifications/me`, {
      method: "GET",
      headers: authHeaders(),
    });

    await handleAuth(res);

    if (!res.ok) {
      const txt = await res.text();
      // Poți comenta throw-ul dacă vrei să nu crape aplicația când backend-ul e jos,
      // dar pentru debug e bine să știi.
      console.warn("Eroare la getNotifications:", txt);
      return [];
    }

    const data: BackendNotification[] = await res.json();
    // Sortăm descrescător după dată (cele mai noi primele), just in case backend-ul nu o face
    return data
      .map(mapNotification)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getUnreadCount(): Promise<number> {
    const token = getAuthToken();
    if (!token) {
      forceLogoutAndRedirect();
      return 0;
    }

    const res = await fetch(`${API_BASE_URL}/notifications/me/unread-count`, {
      method: "GET",
      headers: authHeaders(),
    });

    await handleAuth(res);

    if (!res.ok) return 0;

    const data: { count: number } = await res.json();
    return data.count ?? 0;
  },

  async markAsRead(id: string): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      forceLogoutAndRedirect();
      return;
    }

    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: authHeaders(),
    });

    await handleAuth(res);

    if (!res.ok) {
      const txt = await res.text();
      console.error("Eroare la markAsRead:", txt);
    }
  },

  async markAllAsRead(): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      forceLogoutAndRedirect();
      return;
    }

    const res = await fetch(`${API_BASE_URL}/notifications/me/read-all`, {
      method: "PATCH",
      headers: authHeaders(),
    });

    await handleAuth(res);

    if (!res.ok) {
      const txt = await res.text();
      console.error("Eroare la markAllAsRead:", txt);
    }
  },

  // ✅ CRITIC: Implementarea corectă pentru DELETE ALL
  // Această metodă lipsea sau era implementată greșit în versiunile anterioare
  async deleteAll(): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      forceLogoutAndRedirect();
      return;
    }

    // Apelăm endpoint-ul creat de noi în backend: DELETE /notifications/me/all
    const res = await fetch(`${API_BASE_URL}/notifications/me/all`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    await handleAuth(res);

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Eroare la ștergerea tuturor notificărilor");
    }
  },
};

export default notificationsService;
export { notificationsService };
