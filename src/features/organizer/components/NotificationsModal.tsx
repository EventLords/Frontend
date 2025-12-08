import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Notification } from '../../../types/organizer';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const newCount = notifications.filter(n => n.isNew).length;

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-600';
      case 'warning': return 'bg-yellow-100 text-yellow-600';
      case 'error': return 'bg-red-100 text-red-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

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
          {newCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {newCount} noi
            </span>
          )}
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
            className="text-xs text-[#3F3176] hover:underline flex items-center gap-1"
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
              onClick={() => onMarkAsRead(notification.id)}
              className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                notification.isNew ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${getTypeColor(notification.type)}`}>
                  <Bell size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">
                      {notification.title}
                    </h4>
                    {notification.isNew && (
                      <span className="bg-[#3F3176] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        Nou
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {notification.description}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(notification.date).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
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
            to="/organizer/notifications"
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

export default NotificationsModal;
