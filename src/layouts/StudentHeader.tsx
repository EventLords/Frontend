import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  LogOut,
  User,
  Settings,
  Heart,
  Bookmark,
} from "lucide-react";

import logo from "../assets/events/logo.png";
import { formatNotificationCount } from "../utils/formatNotificationCount";
import StudentNotificationsModal from "../features/students/components/StudentNotificationsModal";
import { profileService } from "../services/profileService";
import { notificationsService } from "../services/notificationsService";
import { StudentNotification } from "../types/student";

interface UserProfile {
  id_user?: number;
  firstName?: string | null;
  lastName?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
}

 interface MenuItemProps {
   to: string;
   icon: React.ReactNode;
   label: string;
   onClick: () => void;
 }

const StudentHeader: React.FC = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const navLinks = [
    { name: "Acasă", path: "/student/home" },
    { name: "Despre noi", path: "/student/about" },
  ];

  const fetchUser = useCallback(async () => {
    try {
      const userData: any = await profileService.getMyProfile();
      setUser(userData);

      const uniqueKey = userData.id_user
        ? `profile_image_${userData.id_user}`
        : `profile_image_${userData.email}`;

      try {
        const savedImage = localStorage.getItem(uniqueKey);
        // ✅ Dacă nu există imagine (sau a fost ștearsă), setăm null explicit
        setProfileImage(savedImage || null);
      } catch (e) {
        console.warn("Storage access error", e);
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUser();
    };
    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [fetchUser]);

  const fetchNotifications = useCallback(async () => {
    try {
      const [list, unread] = await Promise.all([
        notificationsService.getMyNotifications(),
        notificationsService.getUnreadCount(),
      ]);
      setNotifications(list);
      setUnreadCount(unread.count);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await notificationsService.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await notificationsService.markAllAsRead();
    fetchNotifications();
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    setNotifications([]);
    setUnreadCount(0);
    try {
      await notificationsService.deleteAllNotifications();
    } catch (error) {
      console.error("Eroare la ștergerea notificărilor", error);
      fetchNotifications();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || user.first_name || "";
    const lastName = user.lastName || user.last_name || "";
    const firstChar = firstName.length > 0 ? firstName.charAt(0) : "";
    const lastChar = lastName.length > 0 ? lastName.charAt(0) : "";
    return (firstChar + lastChar).toUpperCase() || "U";
  };

  const getFullName = () => {
    if (!user) return "Student";
    const firstName = user.firstName || user.first_name || "";
    const lastName = user.lastName || user.last_name || "";
    return `${firstName} ${lastName}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1023] border-b border-white/5">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              to="/student/dashboard"
              className="flex items-center gap-2 group"
            >
              <img
                src={logo}
                alt="UNIfy Logo"
                className="h-8 w-auto group-hover:scale-105 transition-transform"
              />
              <span className="font-display font-bold text-xl text-white tracking-tight">
                UNIfy
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-300 hover:text-[#a78bfa]"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsUserMenuOpen(false);
                }}
                className={`relative p-2 rounded-full transition-all ${
                  isNotificationsOpen
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-[#a78bfa] hover:bg-white/5"
                }`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0F1023]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <StudentNotificationsModal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClearAll={handleClearAll}
              />
            </div>

            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationsOpen(false);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 overflow-hidden
                  ${
                    isUserMenuOpen
                      ? "border-[#a78bfa]"
                      : "border-white/10 hover:border-white/30"
                  }
                  ${
                    !profileImage
                      ? "bg-[#1E1E40] text-slate-300 hover:text-[#a78bfa]"
                      : ""
                  }
                `}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-[#151632] border border-slate-700 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-700/50 bg-[#1E1E40]/30">
                    <p className="text-sm font-bold text-white truncate">
                      {getFullName()}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user?.email || "Se încarcă..."}
                    </p>
                  </div>
                  <div className="py-2">
                    <MenuItem
                      to="/student/profile"
                      icon={<User size={16} />}
                      label="Profilul meu"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <MenuItem
                      to="/student/favorites"
                      icon={<Heart size={16} />}
                      label="Favorite"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <Link
                      to="/student/notifications"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-[#a78bfa] hover:bg-white/5 transition-colors group w-full"
                    >
                      <span className="text-slate-500 group-hover:text-[#a78bfa] transition-colors">
                        <Bell size={16} />
                      </span>
                      <span className="flex-1 text-left">Notificări</span>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {formatNotificationCount(unreadCount)}
                        </span>
                      )}
                    </Link>
                    <MenuItem
                      to="/student/events?enrolled=true"
                      icon={<Bookmark size={16} />}
                      label="Participările mele"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <MenuItem
                      to="/student/settings"
                      icon={<Settings size={16} />}
                      label="Setări"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                  </div>
                  <div className="border-t border-slate-700/50 pt-1 pb-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} /> Deconectare
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 text-slate-300 hover:text-[#a78bfa]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0F1023] animate-fade-in px-4 py-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-3 px-4 rounded-lg bg-white/5 text-slate-200 hover:text-[#a78bfa] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link
              to="/student/profile"
              className="block py-3 px-4 rounded-lg text-slate-300 hover:text-[#a78bfa] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profilul meu
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left py-3 px-4 rounded-lg text-red-400"
            >
              Deconectare
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-[#a78bfa] hover:bg-white/5 transition-colors group"
  >
    <span className="text-slate-500 group-hover:text-[#a78bfa] transition-colors">
      {icon}
    </span>
    {label}
  </Link>
);

export default StudentHeader;
