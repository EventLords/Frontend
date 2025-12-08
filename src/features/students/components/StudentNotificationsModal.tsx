import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Bell, CheckCircle, AlertCircle, Trash2, CheckCheck } from 'lucide-react';
import { StudentNotification } from '../../../types/student';

interface StudentNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: StudentNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const StudentNotificationsModal: React.FC<StudentNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getNotificationIcon = (type: StudentNotification['type']) => {
    switch (type) {
      case 'enrollment_confirmed':
        return <CheckCircle size={12} className="text-green-600" />;
      case 'event_reminder':
        return <Bell size={12} className="text-blue-600" />;
      case 'event_update':
        return <AlertCircle size={12} className="text-yellow-600" />;
      case 'event_cancelled':
        return <X size={12} className="text-red-600" />;
      default:
        return <Bell size={12} className="text-gray-600" />;
    }
  };

  const getIconBgColor = (type: StudentNotification['type']) => {
    switch (type) {
      case 'enrollment_confirmed':
        return 'bg-green-100';
      case 'event_reminder':
        return 'bg-blue-100';
      case 'event_update':
        return 'bg-yellow-100';
      case 'event_cancelled':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div
      ref={modalRef}
      className="absolute top-16 right-4 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in"
      style={{
        animation: 'slideDown 0.2s ease-out'
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3F3176] to-[#5a4d8a] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-white" />
          <h3 className="text-white font-semibold text-sm">Notificări</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Actions */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100 flex justify-between">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs text-[#3F3176] hover:underline flex items-center gap-1 disabled:opacity-50"
          >
            <CheckCheck size={12} />
            Marchează toate ca citite
          </button>
          <button
            onClick={onClearAll}
            className="text-xs text-red-500 hover:underline flex items-center gap-1"
          >
            <Trash2 size={12} />
            Șterge toate
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nu ai notificări</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
              className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.isRead ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${getIconBgColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 text-center border-t border-gray-100">
          <Link 
            to="/student/notifications"
            onClick={onClose}
            className="text-sm text-[#3F3176] hover:underline font-medium"
          >
            Vezi toate notificările
          </Link>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StudentNotificationsModal;
