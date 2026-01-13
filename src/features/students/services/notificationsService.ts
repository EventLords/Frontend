import { StudentNotification } from '../../../types/student';

const NOTIFICATIONS_KEY = 'unify_student_notifications';

// Funcții interne de ajutor pentru lucrul cu LocalStorage
export const getStoredNotifications = (): StudentNotification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveNotifications = (notifications: StudentNotification[]) => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

// ACESTA ESTE OBIECTUL PE CARE ÎL CAUTĂ STUDENTHEADER.TSX
export const studentNotificationsService = {
  // Returnează toate notificările
  getNotifications: async (): Promise<StudentNotification[]> => {
    return getStoredNotifications();
  },

  // Marchează o singură notificare ca citită
  markAsRead: async (id: string): Promise<void> => {
    const notifications = getStoredNotifications();
    const updated = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    saveNotifications(updated);
  },

  // Marchează totul ca citit
  markAllAsRead: async (): Promise<void> => {
    const notifications = getStoredNotifications();
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    saveNotifications(updated);
  },

  // Șterge toate notificările
  clearAll: async (): Promise<void> => {
    saveNotifications([]);
  }
};

// Export default pentru a permite importul fără acolade: import studentNotificationsService from '...'
export default studentNotificationsService;