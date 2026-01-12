import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Bell, LogOut, User, Settings, FileText } from 'lucide-react';
import logo from '../assets/events/logo.png';
import StudentNotificationsModal from '../features/students/components/StudentNotificationsModal';
import { studentNotificationsService } from '../features/students/services/notificationsService';
import { StudentNotification } from '../types/student';

const StudentHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);

  // Mock user data - in real app, get from auth context
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
      const data = await studentNotificationsService.getNotifications();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    await studentNotificationsService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = async () => {
    await studentNotificationsService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = async () => {
    await studentNotificationsService.clearAll();
    setNotifications([]);
  };

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/student/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="UNIfy Logo" className="h-8 w-auto" />
              <span className="font-display font-bold text-xl text-white">UNIfy</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-300 hover:text-[hsl(240,50%,80%)]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Notifications + Avatar */}
          <div className="flex items-center gap-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsUserMenuOpen(false);
                }}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
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

            {/* User Avatar */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                  style={{
                    backgroundColor: 'hsl(240, 50%, 80%)',
                    color: 'hsl(240, 50%, 25%)'
                  }}
                >
                  {getInitials()}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#1a1a4e]/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-white/60 truncate">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/student/notifications"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-[hsl(240,50%,80%)]/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FileText size={16} />
                      Notificări
                    </Link>
                    <Link
                      to="/student/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-[hsl(240,50%,80%)]/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Profilul meu
                    </Link>
                    <Link
                      to="/student/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-[hsl(240,50%,80%)]/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Setări
                    </Link>
                  </div>
                  <div className="border-t border-white/10 py-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/autentificare';
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Deconectare
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            {/* User Info */}
            <div className="flex items-center gap-3 px-2 py-3 mb-3 bg-white/5 rounded-lg">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: 'hsl(240, 50%, 80%)',
                  color: 'hsl(240, 50%, 25%)'
                }}
              >
                {getInitials()}
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-white/60 text-xs">Student</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `block py-2.5 px-3 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-white/10 mt-3 pt-3">
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/autentificare';
                }}
                className="flex items-center gap-3 w-full py-2.5 px-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Deconectare
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default StudentHeader;
