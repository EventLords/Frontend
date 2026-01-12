// Asigură-te că calea către main service e corectă (3 nivele în sus)
import notificationsService from "../../../services/notificationsService";
import { StudentNotification } from "../../../types/student";

/**
 * Bridge service:
 * - păstrează importurile vechi din students/features
 * - folosește backend notificationsService
 * - metodele de "create/schedule" sunt NO-OP (gestionate de backend)
 */
export const studentNotificationsService = {
  async getNotifications(): Promise<StudentNotification[]> {
    return notificationsService.getMyNotifications();
  },

  async getUnreadCount(): Promise<number> {
    const res = await notificationsService.getUnreadCount();
    return res.count;
  },

  async markAsRead(id: number): Promise<void> {
    await notificationsService.markAsRead(id);
  },

  async markAllAsRead(): Promise<void> {
    await notificationsService.markAllAsRead();
  },

  // ✅ ADĂUGAT: Forwarding pentru ștergere (pentru a menține consistența)
  async deleteNotification(id: number): Promise<void> {
    await notificationsService.deleteNotification(id);
  },

  async deleteAllNotifications(): Promise<void> {
    await notificationsService.deleteAllNotifications();
  },

  // ====== Legacy methods (NO-OP safe) ======
  // Acestea rămân aici ca să nu crape codul vechi care poate le apelează,
  // dar nu fac nimic pentru că backend-ul se ocupă de crearea notificărilor.
  async createEnrollmentNotification(_eventId: string, _eventName: string) {
    return;
  },

  scheduleReminder(
    _eventId: string,
    _eventName: string,
    _eventDate: string,
    _eventTime: string
  ) {
    return;
  },
};

export default studentNotificationsService;
