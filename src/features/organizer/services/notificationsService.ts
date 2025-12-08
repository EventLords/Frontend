import { Notification } from '../../../types/organizer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Mock notifications
let mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Reminder',
    description: 'Pe data de 12.11.2025 vei organiza Conferinta despre Tehnologie și Inovație!',
    date: '2025-11-10',
    isNew: true,
    type: 'info'
  },
  {
    id: '2',
    title: 'Evenimentul tău a fost acceptat',
    description: 'Evenimentul tău a fost acceptat de către administrator, continuă să adaugi detalii.',
    date: '2025-11-08',
    isNew: true,
    type: 'success'
  },
  {
    id: '3',
    title: 'Nou participant',
    description: 'Maria Ionescu s-a înscris la evenimentul HardSkill.',
    date: '2025-11-07',
    isNew: false,
    type: 'info'
  },
  {
    id: '4',
    title: 'Deadline apropiat',
    description: 'Deadline-ul pentru înscrieri la ASii este mâine.',
    date: '2025-11-06',
    isNew: false,
    type: 'warning'
  }
];

export const notificationsService = {
  // Get all notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for notifications');
      return mockNotifications;
    }
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
    } catch (error) {
      console.warn('Mock: Notification marked as read');
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.isNew = false;
      }
    }
  },

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
    } catch (error) {
      console.warn('Mock: All notifications marked as read');
      mockNotifications = mockNotifications.map(n => ({ ...n, isNew: false }));
    }
  },

  // Clear all notifications
  async clearNotifications(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/notifications`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to clear notifications');
    } catch (error) {
      console.warn('Mock: Notifications cleared');
      mockNotifications = [];
    }
  },

  // Get unread count
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter(n => n.isNew).length;
    } catch (error) {
      return mockNotifications.filter(n => n.isNew).length;
    }
  }
};

export default notificationsService;
