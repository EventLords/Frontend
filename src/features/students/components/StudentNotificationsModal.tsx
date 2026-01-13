import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Bell, CheckCheck, Trash2 } from 'lucide-react';
import { StudentNotification } from '../../../types/student';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: StudentNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const StudentNotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications = [],
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
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const getTypeColor = (type: string) => {
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
      className="absolute top-16 right-4 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
      style={{ animation: 'slideDown 0.2s ease-out' }}
    >
      <div className="bg-gradient-to-r from-[#0D0D2B] to-[#1a1a4e] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-white" />
          <h3 className="text-white font-semibold text-sm">Notificări</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount} noi
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100 flex justify-between bg-gray-50">
          <button onClick={onMarkAllAsRead} className="text-xs text-[#3F3176] hover:underline flex items-center gap-1 font-medium">
            <CheckCheck size={12} /> Marchează tot
          </button>
          <button onClick={onClearAll} className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium">
            <Trash2 size={12} /> Șterge tot
          </button>
        </div>
      )}

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nu ai notificări noi</p>
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
                <div className={`p-1.5 rounded-full mt-0.5 ${getTypeColor(notification.type)}`}>
                  <Bell size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm truncate ${!notification.isRead ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                  </div>
                  {/* FIX: Am lăsat doar .message (fără .description) */}
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  {/* FIX: Am lăsat doar .createdAt (fără .date) */}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString('ro-RO')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-3 bg-gray-50 text-center border-t border-gray-100">
        <Link to="/student/notifications" onClick={onClose} className="text-sm text-[#0D0D2B] hover:underline font-bold">
          Vezi toate notificările
        </Link>
      </div>
    </div>
  );
};

export default StudentNotificationsModal;