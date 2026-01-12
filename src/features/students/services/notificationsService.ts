import { StudentNotification } from '../../../types/student';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Store notifications in localStorage for demo
const NOTIFICATIONS_KEY = 'unify_student_notifications';

const getStoredNotifications = (): StudentNotification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : getDefaultNotifications();
  } catch {
    return getDefaultNotifications();
  }
};

const saveNotifications = (notifications: StudentNotification[]) => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

// Default mock notifications
const getDefaultNotifications = (): StudentNotification[] => [
  {
    id: '1',
    type: 'enrollment_confirmed',
    title: 'Înscriere confirmată',
    message: 'Te-ai înscris cu succes la "Conferința Tech Innovation 2024"!',
    eventId: '2',
    eventName: 'Conferința Tech Innovation 2024',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    type: 'event_reminder',
    title: 'Reminder eveniment',
    message: 'Evenimentul "Seminar AI & Machine Learning" începe mâine la ora 14:00.',
    eventId: '4',
    eventName: 'Seminar AI & Machine Learning',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: '3',
    type: 'event_update',
    title: 'Actualizare eveniment',
    message: 'Locația pentru "Workshop React & TypeScript" a fost schimbată în Sala A102.',
    eventId: '1',
    eventName: 'Workshop React & TypeScript',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];

export const studentNotificationsService = {
  // Get all notifications
  async getNotifications(): Promise<StudentNotification[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch {
      return getStoredNotifications();
    }
  },

  // Get unread count
  async getUnreadCount(): Promise<number> {
    const notifications = await this.getNotifications();
    return notifications.filter(n => !n.isRead).length;
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/student/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      const notifications = getStoredNotifications();
      const updated = notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      saveNotifications(updated);
    }
  },

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/student/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      const notifications = getStoredNotifications();
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      saveNotifications(updated);
    }
  },

  // Delete notification
  async deleteNotification(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/student/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      const notifications = getStoredNotifications();
      const filtered = notifications.filter(n => n.id !== id);
      saveNotifications(filtered);
    }
  },

  // Clear all notifications
  async clearAll(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/student/notifications`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      saveNotifications([]);
    }
  },

  // Create enrollment notification
  async createEnrollmentNotification(eventId: string, eventName: string): Promise<StudentNotification> {
    const notification: StudentNotification = {
      id: `notif-${Date.now()}`,
      type: 'enrollment_confirmed',
      title: 'Înscriere confirmată',
      message: `Te-ai înscris cu succes la "${eventName}"!`,
      eventId,
      eventName,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(notification)
      });
      if (!response.ok) throw new Error('Failed to create notification');
      return await response.json();
    } catch {
      const notifications = getStoredNotifications();
      notifications.unshift(notification);
      saveNotifications(notifications);
      return notification;
    }
  },

  // Create reminder notification (24h before event)
  async createReminderNotification(eventId: string, eventName: string, eventDate: string, eventTime: string): Promise<StudentNotification> {
    const notification: StudentNotification = {
      id: `notif-reminder-${Date.now()}`,
      type: 'event_reminder',
      title: 'Reminder eveniment',
      message: `Evenimentul "${eventName}" începe mâine la ora ${eventTime}.`,
      eventId,
      eventName,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(notification)
      });
      if (!response.ok) throw new Error('Failed to create notification');
      return await response.json();
    } catch {
      const notifications = getStoredNotifications();
      notifications.unshift(notification);
      saveNotifications(notifications);
      return notification;
    }
  },

  // Schedule reminder (mock - in real app would use backend scheduler)
  scheduleReminder(eventId: string, eventName: string, eventDate: string, eventTime: string): void {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    const reminderTime = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000); // 24h before
    const now = new Date();

    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime();
      // In a real app, this would be handled by the backend
      setTimeout(() => {
        this.createReminderNotification(eventId, eventName, eventDate, eventTime);
      }, Math.min(delay, 2147483647)); // Max setTimeout delay
    }
  }
};
