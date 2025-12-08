import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, FileText } from 'lucide-react';

interface UserMenuProps {
  firstName: string;
  lastName: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ firstName, lastName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Generate initials
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Generate pastel avatar color
  const generateColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  const bgColor = generateColor(firstName + lastName);
  const textColor = '#1A144E'; // dark indigo, ca în UI

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/autentificare');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {initials}
        </div>

        <ChevronDown
          size={14}
          className={`transition-transform text-[#A493FF] ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E6E0FF] overflow-hidden z-50"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          {/* Info user */}
          <div className="px-4 py-3 bg-[#F3F0FF] border-b border-[#E6E0FF]">
            <p className="font-semibold text-sm text-[#1A144E]">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-[#5E5A80]">Organizator</p>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              to="/organizer/notifications"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3 px-4 py-2.5 text-sm
                text-[#1A144E]
                hover:bg-[hsl(240,50%,80%)]/20
                transition-colors
              "
            >
              <FileText size={16} className="text-[#A493FF]" />
              Notificări
            </Link>

            <Link
              to="/organizer/profile"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3 px-4 py-2.5 text-sm
                text-[#1A144E]
                hover:bg-[hsl(240,50%,80%)]/20
                transition-colors
              "
            >
              <User size={16} className="text-[#A493FF]" />
              Profilul meu
            </Link>

            <Link
              to="/organizer/settings"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3 px-4 py-2.5 text-sm
                text-[#1A144E]
                hover:bg-[hsl(240,50%,80%)]/20
                transition-colors
              "
            >
              <Settings size={16} className="text-[#A493FF]" />
              Setări
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-[#E6E0FF]">
            <button
              onClick={handleLogout}
              className="
                flex items-center gap-3 px-4 py-2.5 text-sm 
                text-red-600 hover:bg-red-50 w-full transition-colors
              "
            >
              <LogOut size={16} />
              Deconectare
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UserMenu;
