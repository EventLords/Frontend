import { useCallback, useEffect, useState } from "react";
import notificationsService from "../features/organizer/services/notificationsService";
import type { Notification } from "../types/organizer";

export function useOrganizerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => n.isNew).length);
    } catch (err) {
      console.error("Failed to load organizer notifications", err);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: string) => {
    await notificationsService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isNew: false } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllAsRead = async () => {
    await notificationsService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // 🔔 badge count la mount
  useEffect(() => {
    notificationsService
      .getUnreadCount()
      .then(setUnreadCount)
      .catch(() => setUnreadCount(0));
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
