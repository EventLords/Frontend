import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  Calendar,
  AlertCircle,
  Check,
  ArrowLeft,
  Loader,
  Info,
  Trash2,
  Clock,
} from "lucide-react";

import { notificationsService } from "../../../services/notificationsService";
import AnimatedBackground from "../../../components/AnimatedBackground";
import {
  StudentNotification,
  StudentNotificationType,
} from "../../../types/student";

import "./NotificationsPage.css";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const location = useLocation();
  const isOrganizer = location.pathname.startsWith("/organizer");
  const dashboardPath = isOrganizer
    ? "/organizer/dashboard"
    : "/student/dashboard";

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationsService.getMyNotifications();
      const sortedData = Array.isArray(data)
        ? data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [];
      setNotifications(sortedData);
    } catch (error) {
      console.error("Eroare la preluarea notificărilor:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await notificationsService.markAsRead(id);
      window.dispatchEvent(new Event("profile-updated"));
    } catch (error) {
      console.error("Eroare la marcare citit:", error);
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    const hasUnread = notifications.some((n) => !n.isRead);
    if (!hasUnread) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await notificationsService.markAllAsRead();
      window.dispatchEvent(new Event("profile-updated"));
    } catch (error) {
      console.error("Eroare la marcare toate ca citite:", error);
      fetchNotifications();
    }
  };

  const handleDelete = async (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationsService.deleteNotification(id);
      window.dispatchEvent(new Event("profile-updated"));
    } catch (error) {
      console.error("Eroare la ștergere:", error);
      fetchNotifications();
    }
  };

  // ✅ MODIFICARE: Fără confirmare (modal)
  const handleClearAll = async () => {
    if (notifications.length === 0) return;

    // Eliminare imediată din UI (Optimistic UI)
    setNotifications([]);

    try {
      await notificationsService.deleteAllNotifications();
      window.dispatchEvent(new Event("profile-updated"));
    } catch (error) {
      console.error("Eroare la ștergerea tuturor notificărilor:", error);
      fetchNotifications(); // Revert dacă eșuează
    }
  };

  const getNotificationIcon = (type: StudentNotificationType) => {
    switch (type) {
      case "EVENT_REGISTERED":
      case "ACCOUNT_APPROVED":
      case "EVENT_APPROVED":
        return <CheckCircle size={20} className="text-green-400" />;
      case "FAVORITE_REMINDER_24H":
      case "FAVORITE_REMINDER_1H":
        return <Calendar size={20} className="text-blue-400" />;
      case "EVENT_UPDATED":
      case "FEEDBACK_REQUESTED":
        return <Info size={20} className="text-purple-400" />;
      case "EVENT_DELETED":
      case "EVENT_REJECTED":
      case "ACCOUNT_REJECTED":
      case "EVENT_FULL":
        return <AlertCircle size={20} className="text-red-400" />;
      default:
        return <Bell size={20} className="text-gray-400" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "chiar acum";
    if (minutes < 60) return `acum ${minutes} min`;
    if (hours < 24) return `acum ${hours}h`;
    if (days < 7) return `acum ${days} zile`;
    return date.toLocaleDateString("ro-RO");
  };

  const groupNotifications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today.getTime() - 7 * 86400000);
    const groups: {
      label: string;
      notifications: StudentNotification[];
    }[] = [
      { label: "Astăzi", notifications: [] },
      { label: "Săptămâna aceasta", notifications: [] },
      { label: "Mai vechi", notifications: [] },
    ];
    const filtered =
      filter === "unread"
        ? notifications.filter((n) => !n.isRead)
        : notifications;

    filtered.forEach((notification) => {
      const date = new Date(notification.createdAt);
      date.setHours(0, 0, 0, 0);
      if (date.getTime() === today.getTime()) {
        groups[0].notifications.push(notification);
      } else if (date >= weekAgo) {
        groups[1].notifications.push(notification);
      } else {
        groups[2].notifications.push(notification);
      }
    });
    return groups.filter((g) => g.notifications.length > 0);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#a78bfa] animate-spin mx-auto mb-4" />
          <p className="text-white/60">Se încarcă notificările...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-20 relative">
      <AnimatedBackground />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 uni-title">
            Notificări
          </h1>
          <p className="text-white/60">
            {unreadCount > 0
              ? `Ai ${unreadCount} notificări necitite`
              : "Toate notificările au fost citite"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <Link
            to={dashboardPath}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Înapoi</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Toate
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === "unread"
                    ? "bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Necitite
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 py-1.5 text-sm font-medium text-[#c4b5fd] hover:bg-[#a78bfa]/10 rounded-lg transition-colors flex items-center gap-1"
              >
                <Check size={16} />
                Marchează toate
              </button>
            )}
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5">
          <Bell size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Nu ai notificări
          </h3>
          <p className="text-white/60">
            Aici vor apărea noutățile legate de evenimentele și activitatea ta.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupNotifications().length === 0 && filter === "unread" ? (
            <div className="text-center py-12 text-white/40">
              Nu există notificări necitite.
            </div>
          ) : (
            groupNotifications().map((group) => (
              <div key={group.label}>
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4 px-1">
                  {group.label}
                </h2>
                <div className="space-y-3">
                  {group.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 transition-all hover:bg-white/10 group relative ${
                        !notification.isRead
                          ? "border-l-4 border-l-[#a78bfa]"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white text-base">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f] rounded">
                                NOU
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/70 mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-white/40 flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(notification.createdAt)}
                          </p>
                          {notification.actionUrl && (
                            <Link
                              to={notification.actionUrl}
                              className="inline-block mt-3 text-xs font-bold text-[#a78bfa] hover:text-white transition-colors"
                            >
                              Vezi detalii &rarr;
                            </Link>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-2 text-white/40 hover:text-[#c4b5fd] hover:bg-[#a78bfa]/10 rounded-lg transition-colors"
                              title="Marchează ca citit"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Șterge"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {notifications.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <button
            onClick={handleClearAll}
            className="px-6 py-3 text-sm font-medium text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-red-900/10"
          >
            <Trash2 size={18} />
            Șterge toate notificările
          </button>
          <p className="text-xs text-white/30 mt-3">
            Această acțiune este ireversibilă.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;