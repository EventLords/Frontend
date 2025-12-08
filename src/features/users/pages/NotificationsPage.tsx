import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, CheckCircle, Calendar, AlertCircle, X, Trash2, Check, ArrowLeft } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'enrollment_confirmed' | 'event_reminder' | 'event_update' | 'event_cancelled' | 'admin';
  isRead: boolean;
  createdAt: string;
  eventId?: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Înscrierea a fost confirmată',
        message: 'Te-ai înscris cu succes la evenimentul "Workshop React Advanced".',
        type: 'enrollment_confirmed',
        isRead: false,
        createdAt: new Date().toISOString(),
        eventId: '1'
      },
      {
        id: '2',
        title: 'Reminder eveniment',
        message: 'Evenimentul "Hackathon USV 2024" începe mâine la ora 09:00.',
        type: 'event_reminder',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        eventId: '2'
      },
      {
        id: '3',
        title: 'Actualizare eveniment',
        message: 'Locația pentru "Conferința Tech Leaders" a fost schimbată în Aula Magna.',
        type: 'event_update',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        eventId: '3'
      },
      {
        id: '4',
        title: 'Eveniment anulat',
        message: 'Din păcate, evenimentul "Networking Night" a fost anulat.',
        type: 'event_cancelled',
        isRead: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        eventId: '4'
      },
      {
        id: '5',
        title: 'Mesaj administrativ',
        message: 'Bine ai venit pe platforma UNIfy! Descoperă evenimentele disponibile.',
        type: 'admin',
        isRead: true,
        createdAt: new Date(Date.now() - 604800000).toISOString()
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 500);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'enrollment_confirmed':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'event_reminder':
        return <Calendar size={20} className="text-blue-400" />;
      case 'event_update':
        return <AlertCircle size={20} className="text-yellow-400" />;
      case 'event_cancelled':
        return <X size={20} className="text-red-400" />;
      case 'admin':
        return <Bell size={20} className="text-purple-400" />;
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

    if (minutes < 60) return `acum ${minutes} min`;
    if (hours < 24) return `acum ${hours}h`;
    if (days < 7) return `acum ${days} zile`;
    return date.toLocaleDateString('ro-RO');
  };

  const groupNotifications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    const groups: { label: string; notifications: Notification[] }[] = [
      { label: 'Astăzi', notifications: [] },
      { label: 'Săptămâna aceasta', notifications: [] },
      { label: 'Mai vechi', notifications: [] }
    ];

    const filtered = filter === 'unread' 
      ? notifications.filter(n => !n.isRead)
      : notifications;

    filtered.forEach(notification => {
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

    return groups.filter(g => g.notifications.length > 0);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-white/20 border-t-[#4ECDC4] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Se încarcă notificările...</p>
        </div>
      </div>
    );
  }

  // Detect if user is organizer or student based on current URL
  const location = useLocation();
  const isOrganizer = location.pathname.startsWith('/organizer');
  const dashboardPath = isOrganizer ? '/organizer/dashboard' : '/student/dashboard';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to={dashboardPath}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Înapoi la Dashboard</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Notificări
          </h1>
          <p className="text-white/60">
            {unreadCount > 0 
              ? `Ai ${unreadCount} notificări necitite`
              : 'Toate notificările au fost citite'
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-[#4ECDC4] text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Toate
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'unread'
                  ? 'bg-[#4ECDC4] text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Necitite
            </button>
          </div>

          {/* Mark All as Read */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 text-sm font-medium text-[#4ECDC4] hover:bg-[#4ECDC4]/10 rounded-lg transition-colors"
            >
              <Check size={16} className="inline mr-1" />
              Marchează toate
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Nu ai notificări
          </h3>
          <p className="text-white/60">
            Vei primi notificări când te înscrii la evenimente
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupNotifications().map((group) => (
            <div key={group.label}>
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
                {group.label}
              </h2>
              <div className="space-y-3">
                {group.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 transition-all hover:bg-white/10 ${
                      !notification.isRead ? 'border-l-4 border-l-[#4ECDC4]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#4ECDC4] text-white rounded">
                              NOU
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/70 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-white/40">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-white/40 hover:text-[#4ECDC4] hover:bg-[#4ECDC4]/10 rounded-lg transition-colors"
                            title="Marchează ca citit"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Șterge"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 size={16} className="inline mr-2" />
            Șterge toate notificările
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
