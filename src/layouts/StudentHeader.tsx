import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Bell, LogOut, User, Settings, FileText } from 'lucide-react';
import logo from '../assets/events/logo.png';
import StudentNotificationsModal from '../features/students/components/StudentNotificationsModal';
import studentNotificationsService from '../features/students/services/notificationsService';
import { StudentNotification } from '../types/student';

const StudentHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);

  const user = {
    firstName: 'Alexandru',
    lastName: 'Popescu',
    email: 'alexandru.popescu@student.usv.ro'
  };

  const navLinks = [
    { name: 'Acasă', path: '/' },
    { name: 'Despre noi', path: '/despre-noi' },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Verificăm dacă service-ul și metoda există
        if (studentNotificationsService && typeof studentNotificationsService.getNotifications === 'function') {
          const data = await studentNotificationsService.getNotifications();
          setNotifications(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Eroare la încărcarea notificărilor:", error);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  // Folosim Array.isArray pentru siguranță maximă
  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => n && !n.isRead).length 
    : 0;

  const handleMarkAsRead = async (id: string) => {
    try {
      await studentNotificationsService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) { console.error(e); }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await studentNotificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) { console.error(e); }
  };

  const handleClearAll = async () => {
    try {
      await studentNotificationsService.clearAll();
      setNotifications([]);
    } catch (e) { console.error(e); }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D2B] h-16">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/student/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-xl text-white">UNIfy</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-300 hover:text-white"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] rounded-full flex items-center justify-center text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Avatar - Click deschide meniul */}
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold"
            >
              {user.firstName[0]}{user.lastName[0]}
            </button>
          </div>
        </div>
      </div>

      {/* Modale */}
      <StudentNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications || []}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
      />

      {/* Dropdown Utilizator */}
      {isUserMenuOpen && (
        <div className="absolute right-4 top-16 w-48 bg-[#1a1a4e] border border-white/10 rounded-lg shadow-xl py-2">
          <Link to="/student/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5">
            <User size={14} /> Profil
          </Link>
          <Link to="/student/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5">
            <Settings size={14} /> Setări
          </Link>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/autentificare'; }}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/5"
          >
            <LogOut size={14} /> Ieșire
          </button>
        </div>
      )}
    </header>
  );
};

export default StudentHeader;