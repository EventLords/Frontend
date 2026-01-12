import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  FileCheck,
  Calendar,
  Users,
  AlertTriangle,
} from "lucide-react";

import { useNotifications } from "../../../hooks/useNotifications";
import { StudentNotification } from "../../../types/student";

interface AdminNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminNotificationsModal: React.FC<AdminNotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteAll,
  } = useNotifications(15000);

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

  const getTypeIcon = (type: StudentNotification["type"]) => {
    switch (type) {
      case "ADMIN_ORGANIZER_PENDING":
      case "ACCOUNT_CREATED":
        return <Users size={14} className="text-orange-400" />;
      case "ADMIN_EVENT_PENDING":
      case "EVENT_SUBMITTED_FOR_REVIEW":
        return <Calendar size={14} className="text-blue-400" />;
      case "FEEDBACK_REQUESTED":
        return <FileCheck size={14} className="text-green-400" />;
      case "ACCOUNT_REJECTED":
      case "EVENT_REJECTED":
      case "EVENT_DELETED":
        return <AlertTriangle size={14} className="text-red-400" />;
      default:
        return <Bell size={14} className="text-[#a78bfa]" />;
    }
  };

  const getTypeBgColor = (type: StudentNotification["type"]) => {
    switch (type) {
      case "ADMIN_ORGANIZER_PENDING":
      case "ACCOUNT_CREATED":
        return "bg-orange-500/20";
      case "ADMIN_EVENT_PENDING":
      case "EVENT_SUBMITTED_FOR_REVIEW":
        return "bg-blue-500/20";
      case "FEEDBACK_REQUESTED":
        return "bg-green-500/20";
      case "ACCOUNT_REJECTED":
      case "EVENT_REJECTED":
      case "EVENT_DELETED":
        return "bg-red-500/20";
      default:
        return "bg-[#a78bfa]/20";
    }
  };

  const isUnread = (n: StudentNotification) => !n.isRead;

  // ✅ MODIFICARE: Funcție simplă fără confirmare
  const handleClearAll = () => {
    deleteAll();
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 99998 }}
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className="fixed top-16 right-4 w-80 md:w-96 bg-[#12162a] rounded-xl shadow-2xl border border-[#a78bfa]/30 overflow-hidden"
        style={{
          animation: "slideDown 0.2s ease-out",
          zIndex: 99999,
        }}
      >
        <div className="bg-gradient-to-r from-[#1a1040] to-[#2E1760] px-4 py-3 flex items-center justify-between border-b border-[#a78bfa]/20">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#a78bfa]" />
            <h3 className="text-white font-semibold text-sm">
              Notificări Admin
            </h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount} noi
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="px-4 py-2 border-b border-[#a78bfa]/10 flex justify-between bg-[#0b0f1f]/50">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs text-[#c4b5fd] hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck size={12} />
              Marchează toate ca citite
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} />
              Curăță (sterge tot)
            </button>
          </div>
        )}

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-white/40">
              <p className="text-sm">Se încarcă...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-white/40">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nu ai notificări</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => isUnread(n) && markAsRead(Number(n.id))}
                className={`px-4 py-3 border-b border-[#a78bfa]/5 hover:bg-[#a78bfa]/10 cursor-pointer transition-colors ${
                  isUnread(n) ? "bg-[#a78bfa]/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeBgColor(n.type)}`}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-white truncate">
                        {n.title}
                      </h4>
                      {isUnread(n) && (
                        <span className="bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] text-[#0b0f1f] text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                          Nou
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      {new Date(n.createdAt).toLocaleString("ro-RO")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>,
    document.body
  );
};

export default AdminNotificationsModal;
