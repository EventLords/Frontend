import api from "./api";
// Asigură-te că tipul StudentNotification este definit corect în types/student
// De obicei arată ceva de genul:
// export interface StudentNotification {
//   id: number;
//   type: string; // sau enum
//   title: string;
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   actionUrl?: string;
// }
import { StudentNotification } from "../types/student";

// =========================
// TYPES (raw backend responses)
// =========================

export type NotificationType =
  | "EVENT_CREATED"
  | "EVENT_UPDATED"
  | "EVENT_DELETED"
  | "EVENT_APPROVED"
  | "EVENT_REJECTED"
  | "EVENT_SUBMITTED_FOR_REVIEW"
  | "EVENT_REGISTERED"
  | "EVENT_UNREGISTERED"
  | "EVENT_FULL"
  | "EVENT_THRESHOLD_REACHED"
  | "EVENT_FAVORITED"
  | "EVENT_RECOMMENDED"
  | "ACCOUNT_CREATED"
  | "ACCOUNT_APPROVED"
  | "ACCOUNT_REJECTED"
  | "ADMIN_EVENT_PENDING"
  | "ADMIN_ORGANIZER_PENDING"
  | "FEEDBACK_REQUESTED"
  | "FAVORITE_REMINDER_24H"
  | "FAVORITE_REMINDER_1H";

export interface Notification {
  id_notification: number;
  user_id: number;
  event_id: number | null;
  type: NotificationType;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export interface UnreadCountResponse {
  count: number;
}

// =========================
// ADAPTER: backend -> UI model (StudentNotification)
// =========================

const toStudentNotification = (n: Notification): StudentNotification => ({
  id: n.id_notification,
  type: n.type,
  title: n.title,
  message: n.message,
  isRead: n.read_at !== null,
  createdAt: n.created_at,
  // Exemplu de logică pentru actionUrl bazată pe tip
  actionUrl: n.type === "FEEDBACK_REQUESTED" ? "/student/my-events" : undefined,
});

// =========================
// NOTIFICATIONS SERVICE
// =========================

export const notificationsService = {
  // RAW (dacă îți trebuie undeva exact backend shape)
  async getMyNotificationsRaw(): Promise<Notification[]> {
    const response = await api.get<Notification[]>("/notifications/me");
    return response.data;
  },

  // ✅ UI model (recomandat pentru componente)
  async getMyNotifications(): Promise<StudentNotification[]> {
    const response = await api.get<Notification[]>("/notifications/me");
    // Verificăm dacă response.data este un array înainte de mapare
    if (!Array.isArray(response.data)) {
      console.error("Invalid notifications data format", response.data);
      return [];
    }
    return response.data.map(toStudentNotification);
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await api.get<UnreadCountResponse>(
      "/notifications/me/unread-count"
    );
    return response.data;
  },

  async markAsRead(notificationId: number): Promise<{ success: boolean }> {
    const response = await api.patch<{ success: boolean }>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    const response = await api.patch<{ success: boolean }>(
      "/notifications/me/read-all"
    );
    return response.data;
  },

  // ✅ Metodele de ștergere adăugate corect și expuse
  async deleteNotification(notificationId: number): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },

  async deleteAllNotifications(): Promise<void> {
    await api.delete("/notifications/me/all");
  },
};

export default notificationsService;
