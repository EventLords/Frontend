import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Bell,
  CheckCircle,
  AlertCircle,
  Trash2,
  Check,
  Calendar,
  Info,
} from "lucide-react";
import {
  StudentNotification,
  StudentNotificationType,
} from "../../../types/student";

interface StudentNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: StudentNotification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void; // ✅ Prop nou adăugat
}

const StudentNotificationsModal: React.FC<StudentNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on click outside & Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Helper iconițe
  const getNotificationIcon = (type: StudentNotificationType) => {
    switch (type) {
      case "EVENT_REGISTERED":
      case "ACCOUNT_APPROVED":
      case "EVENT_APPROVED":
        return <CheckCircle size={14} className="text-green-400" />;
      case "FAVORITE_REMINDER_24H":
      case "FAVORITE_REMINDER_1H":
        return <Calendar size={14} className="text-blue-400" />;
      case "EVENT_UPDATED":
      case "FEEDBACK_REQUESTED":
        return <Info size={14} className="text-purple-400" />; // Sau Star pentru feedback
      case "EVENT_DELETED":
      case "EVENT_REJECTED":
        return <AlertCircle size={14} className="text-red-400" />;
      default:
        return <Bell size={14} className="text-gray-400" />;
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return createPortal(
    <>
      {/* Backdrop overlay with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 99998 }}
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="fixed top-16 right-4 w-80 md:w-96 bg-[#151632] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden origin-top-right animate-in fade-in zoom-in-95"
        style={{ zIndex: 99999 }}
      >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-[#1E1E40]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-white" />
          <h3 className="font-bold text-white text-sm">Notificări</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount} noi
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Actions Toolbar */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-b border-slate-700/50 bg-[#1E1E40]/30 flex items-center justify-between text-xs">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={12} /> Marchează toate ca citite
          </button>

          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 size={12} /> Șterge toate
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell size={20} className="text-slate-600" />
            </div>
            <p className="text-slate-400 text-sm">Nu ai notificări noi</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() =>
                !notification.isRead && onMarkAsRead(notification.id)
              }
              className={`p-3 border-b border-slate-700/50 hover:bg-white/5 transition-colors cursor-pointer relative group ${
                !notification.isRead ? "bg-white/[0.03]" : ""
              } ${
                notification.type === "FEEDBACK_REQUESTED"
                  ? "bg-gradient-to-r from-yellow-500/5 to-transparent"
                  : ""
              }`}
            >
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 p-1 bg-white/5 rounded-full">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4
                      className={`text-sm font-semibold truncate pr-2 ${
                        !notification.isRead ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-[#a78bfa] rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-1.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {formatTime(notification.createdAt)}
                    </span>

                    {/* Action Button (ex: Feedback) */}
                    {notification.actionUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification.id);
                          navigate(notification.actionUrl!);
                          onClose();
                        }}
                        className="text-[10px] font-bold text-[#a78bfa] hover:text-white transition-colors bg-[#a78bfa]/10 px-2 py-0.5 rounded hover:bg-[#a78bfa]/20"
                      >
                        Vezi detalii
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2.5 bg-[#1E1E40]/50 text-center border-t border-slate-700/50">
          <Link
            to="/student/notifications"
            onClick={onClose}
            className="text-xs font-bold text-[#a78bfa] hover:text-white transition-colors block py-1"
          >
            Vezi toate notificările
          </Link>
        </div>
      )}
    </div>
    </>,
    document.body
  );
};

export default StudentNotificationsModal;
