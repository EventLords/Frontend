import { Bell, Check } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { StudentNotification } from "../types/student";

export default function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <div className="relative">
      <button className="relative">
        <Bell className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      <div className="absolute right-0 mt-2 w-96 bg-[#14162a] border border-white/10 rounded-xl shadow-xl z-50">
        <div className="flex justify-between items-center p-3 border-b border-white/10">
          <span className="text-white font-semibold">Notificări</span>
          <button
            onClick={markAllAsRead}
            className="text-sm text-purple-400 hover:underline"
          >
            Marchează toate ca citite
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="p-4 text-white/60 text-sm">Nu ai notificări</p>
          )}

          {notifications.map((n: StudentNotification) => (
            <div
              key={n.id}
              className={`p-4 border-b border-white/5 ${
                !n.isRead ? "bg-white/5" : ""
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-white font-medium">{n.title}</p>
                  <p className="text-white/60 text-sm">{n.message}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                {!n.isRead && (
                  <button onClick={() => markAsRead(n.id)}>
                    <Check size={16} className="text-green-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
