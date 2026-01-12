import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import logo from "../assets/events/logo.png";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ firstName?: string; lastName?: string; role?: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user?.role) return "/";
    if (user.role === "student") return "/student/dashboard";
    if (user.role === "organizer") return "/organizer/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/";
  };

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const navLinks = [
    { name: "Acasă", path: "/" },
    { name: "Despre noi", path: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D2B]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="UNIfy Logo" className="h-8 w-auto" />
              <span className="font-display font-bold text-xl text-white">
                UNIfy
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-300 hover:text-[#a78bfa]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Auth / User Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-[#a78bfa] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold">
                    {getInitials()}
                  </div>
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Ieșire</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-300 hover:text-[#a78bfa] transition-colors"
              >
                Autentificare
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2.5 px-3 text-sm rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-[#a78bfa] hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              {isLoggedIn ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 py-2.5 px-3 text-sm text-gray-300 hover:text-[#a78bfa] hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 py-2.5 px-3 text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Ieșire
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block py-2.5 px-3 text-sm text-gray-300 hover:text-[#a78bfa] hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Autentificare
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
