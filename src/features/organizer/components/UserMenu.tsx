import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown, FileText } from "lucide-react";

interface UserMenuProps {
  firstName: string;
  lastName: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ firstName, lastName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const generateColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 80%)`;
  };

  const bgColor = generateColor(firstName + lastName);
  const textColor = "#1A144E";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
          className={`transition-transform text-[#A493FF] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-[#1a1a4e]/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium text-white">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-white/60">Organizator</p>
          </div>

          <div className="py-2">
            <Link
              to="/organizer/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
            >
              <FileText size={16} />
              Notificări
            </Link>

            <Link
              to="/organizer/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
            >
              <User size={16} />
              Profilul meu
            </Link>

            <Link
              to="/organizer/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
            >
              <Settings size={16} />
              Setări
            </Link>
          </div>

          <div className="border-t border-white/10 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={16} />
              Deconectare
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
