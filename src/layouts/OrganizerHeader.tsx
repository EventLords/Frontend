import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell, User, Settings, LogOut } from "lucide-react";
import logo from "../assets/events/logo.png";

import NotificationsModal from "../features/organizer/components/NotificationsModal";

import notificationsService from "../features/organizer/services/notificationsService";
import { profileService } from "../services/profileService";
import type { Notification } from "../types/organizer";

interface OrganizerProfile {
  id?: number; // Avem nevoie de ID pentru a găsi cheia corectă a imaginii
  firstName: string;
  lastName: string;
  email: string;
}

const OrganizerHeader: React.FC = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // State pentru utilizator și imagine
  const [user, setUser] = useState<OrganizerProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const navLinks = [
    { name: "Acasă", path: "/organizer/home" },
    { name: "Despre noi", path: "/organizer/about" },
  ];

  // ==========================================
  // 1. FETCH USER DATA & IMAGE
  // ==========================================
  const fetchUser = useCallback(async () => {
    try {
      const userData: any = await profileService.getMyProfile();

      // Setăm datele userului
      setUser({
        id: userData.id_user,
        firstName: userData.first_name || "Organizator",
        lastName: userData.last_name || "",
        email: userData.email,
      });

      // ✅ Încărcăm și imaginea de profil (folosind aceeași logică din ProfilePage)
      const storageKey = `profile_image_${userData.id_user || "user"}`;
      const savedImage = localStorage.getItem(storageKey);
      setProfileImage(savedImage);
    } catch (error) {
      console.error("Failed to fetch organizer profile", error);
    }
  }, []);

  // Apel inițial
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ✅ LISTENER PENTRU ACTUALIZĂRI INSTANTANEE
  // Când editezi profilul în ProfilePage, acesta emite "profile-updated"
  // Noi ascultăm aici și reîncărcăm datele fără refresh
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUser();
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [fetchUser]);

  // ==========================================
  // 2. NOTIFICATIONS LOGIC
  // ==========================================
  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => n.isNew).length);
    } catch (e) {
      console.error("Failed to load notifications", e);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  // Click Outside Listener
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

  const toggleNotifications = async () => {
    const next = !isNotificationsOpen;
    setIsNotificationsOpen(next);
    if (next) {
      setIsUserMenuOpen(false);
      await loadNotifications();
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationsService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isNew: false } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllAsRead = async () => {
    await notificationsService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
    setUnreadCount(0);
  };

  const handleClearAll = async () => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      if (typeof notificationsService.deleteAll === "function") {
        await notificationsService.deleteAll();
      }
    } catch (error) {
      console.error("Failed to clear notifications", error);
      loadNotifications();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Helpers UI
  const getInitials = () => {
    if (!user) return "O";
    const first = user.firstName.charAt(0).toUpperCase();
    const last = user.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  };

  const getFullName = () => {
    if (!user) return "Organizator";
    return `${user.firstName} ${user.lastName}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D2B] border-b border-white/5">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO & NAV */}
          <div className="flex items-center gap-6">
            <Link to="/organizer/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="UNIfy" className="h-8" />
              <span className="text-white font-bold text-xl tracking-tight">
                UNIfy
              </span>
            </Link>

            <nav className="hidden lg:flex gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/70 hover:text-[#a78bfa] transition-colors text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {/* 🔔 Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className={`relative p-2 rounded-full transition-all ${
                  isNotificationsOpen
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:text-[#a78bfa] hover:bg-white/5"
                }`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0D0D2B]">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationsModal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClearAll={handleClearAll}
              />
            </div>

            {/* 👤 User Menu Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationsOpen(false);
                }}
                // ✅ UPDATED: Afișează imaginea dacă există, altfel inițialele
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 overflow-hidden
                  ${
                    isUserMenuOpen
                      ? "border-[#8B5CF6] bg-[#8B5CF6]/20 text-[#8B5CF6]"
                      : "border-white/10 bg-[#1E1E40] text-slate-300 hover:border-white/30 hover:text-[#a78bfa]"
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

              {/* Dropdown Content */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#151632] border border-slate-700 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-700/50 bg-[#1E1E40]/30">
                    <p className="text-sm font-bold text-white truncate">
                      {getFullName()}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user?.email || "Se încarcă..."}
                    </p>
                  </div>

                  {/* MENIU REORDONAT */}
                  <div className="py-2">
                    <Link
                      to="/organizer/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-[#a78bfa] hover:bg-white/5 transition-colors group"
                    >
                      <User
                        size={16}
                        className="text-slate-500 group-hover:text-[#8B5CF6]"
                      />
                      Profilul meu
                    </Link>

                    <Link
                      to="/organizer/notifications"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-[#a78bfa] hover:bg-white/5 transition-colors group w-full"
                    >
                      <div className="relative">
                        <Bell
                          size={16}
                          className="text-slate-500 group-hover:text-[#8B5CF6]"
                        />
                      </div>
                      <span className="flex-1 text-left">Notificări</span>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/organizer/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-[#a78bfa] hover:bg-white/5 transition-colors group"
                    >
                      <Settings
                        size={16}
                        className="text-slate-500 group-hover:text-[#8B5CF6]"
                      />
                      Setări
                    </Link>
                  </div>

                  <div className="border-t border-slate-700/50 pt-1 pb-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} />
                      Deconectare
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 text-white/80 hover:text-[#a78bfa]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0D0D2B] animate-fade-in px-4 py-4 absolute w-full shadow-2xl">
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
              to="/organizer/profile"
              className="block py-3 px-4 rounded-lg text-slate-300 hover:text-[#a78bfa] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profilul meu
            </Link>
            <Link
              to="/organizer/notifications"
              className="block py-3 px-4 rounded-lg text-slate-300 hover:text-[#a78bfa] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Notificări
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              to="/organizer/settings"
              className="block py-3 px-4 rounded-lg text-slate-300 hover:text-[#a78bfa] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Setări
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

export default OrganizerHeader;
