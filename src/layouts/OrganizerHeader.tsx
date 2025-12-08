import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, LogOut } from 'lucide-react';
import logo from '../assets/events/logo.png';
import NotificationsModal from '../features/organizer/components/NotificationsModal';
import UserMenu from '../features/organizer/components/UserMenu';
import { notificationsService } from '../features/organizer/services/notificationsService';
import { Notification } from '../types/organizer';

const OrganizerHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock user data - in real app, get from auth context
  const user = {
    firstName: 'Emma',
    lastName: 'Popescu'
  };

  const navLinks = [
    { name: 'Acasă', path: '/' },
    { name: 'Despre noi', path: '/despre-noi' },
  ];

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => n.isNew).length;

  const handleMarkAsRead = async (id: string) => {
    await notificationsService.markAsRead(id);
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isNew: false } : n)
    );
  };

  const handleMarkAllAsRead = async () => {
    await notificationsService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
  };

  const handleClearAll = async () => {
    await notificationsService.clearNotifications();
    setNotifications([]);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Main Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/organizer/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="UNIfy Logo" className="h-8 w-auto" />
              <span className="font-display font-bold text-lg text-white">UNIfy</span>
            </Link>

            {/* Public Links - Desktop */}
            <nav className="hidden lg:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-white/70 hover:text-[hsl(240,50%,80%)] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Notifications + Avatar + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-white/80 hover:text-white transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Avatar Menu */}
            <div className="hidden md:block">
              <UserMenu firstName={user.firstName} lastName={user.lastName} />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 animate-fade-in">
            {/* User Info - Mobile */}
            <div className="flex items-center gap-3 px-2 py-3 mb-3 bg-white/5 rounded-lg">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: 'hsl(280, 70%, 80%)', color: 'hsl(240, 50%, 25%)' }}
              >
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-white/60 text-xs">Organizator</p>
              </div>
            </div>

            {/* Public Links */}
            <div className="mb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2.5 px-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Logout - Mobile */}
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

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
      />
    </header>
  );
};

export default OrganizerHeader;
