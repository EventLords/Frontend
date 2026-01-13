import { Notification } from '../../../types/organizer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
    description: 'Evenimentul tău a fost acceptat de către administrator.',
    date: '2025-11-08',
    isNew: true,
    type: 'success'
  }
];

export const notificationsService = {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/notifications`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (error) {
      return mockNotifications;
    }
  },

  async markAsRead(id: string): Promise<void> {
    const n = mockNotifications.find(notif => notif.id === id);
    if (n) n.isNew = false;
  },

  async markAllAsRead(): Promise<void> {
    mockNotifications = mockNotifications.map(n => ({ ...n, isNew: false }));
  },

  async clearNotifications(): Promise<void> {
    mockNotifications = [];
  }
};

export default notificationsService;