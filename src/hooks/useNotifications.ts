import { useState, useEffect, useCallback } from "react";
import { notificationsService } from "../services/notificationsService";
import { StudentNotification } from "../types/student";

export const useNotifications = (pollMs: number = 15000) => {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Funcția principală de fetch
  const fetchAll = useCallback(async () => {
    try {
      const [list, unread] = await Promise.all([
        notificationsService.getMyNotifications(),
        notificationsService.getUnreadCount(),
      ]);

      // Sortare descrescătoare după dată
      const sortedList = Array.isArray(list)
        ? list.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [];

      setNotifications(sortedList);
      setUnreadCount(unread.count);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling automat
  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, pollMs);

    // Ascultăm evenimentul custom pentru actualizări manuale din alte componente
    const handleUpdate = () => fetchAll();
    window.addEventListener("profile-updated", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("profile-updated", handleUpdate);
    };
  }, [fetchAll, pollMs]);

  // --- ACȚIUNI ---

  const markAsRead = async (id: number) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await notificationsService.markAsRead(id);
      // Nu e nevoie de fetchAll imediat dacă optimizarea a reușit,
      // dar pentru siguranță putem emite un event global
      window.dispatchEvent(new Event("profile-updated"));
    } catch (error) {
      console.error("Error marking as read", error);
      fetchAll(); // Revert on error
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await notificationsService.markAllAsRead();
      window.dispatchEvent(new Event("profile-updated"));
    } catch (error) {
      console.error("Error marking all as read", error);
      fetchAll();
    }
  };

  const deleteAll = async () => {
    // Optimistic update
    setNotifications([]);
    setUnreadCount(0);

    try {
      await notificationsService.deleteAllNotifications();
      window.dispatchEvent(new Event("profile-updated"));
    } catch (error) {
      console.error("Error deleting all notifications", error);
      fetchAll();
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteAll,
    refresh: fetchAll,
  };
};
