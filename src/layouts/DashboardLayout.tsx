import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Menu,
  Shield,
} from "lucide-react";
import "./DashboardLayout.css";
import AnimatedBackground from "../components/AnimatedBackground";
import AdminNotificationsModal from "../features/admin/components/AdminNotificationsModal";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ FIX: Extragem corect [state, setState]
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Meniul Admin (fără Setări)
  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Calendar, label: "Evenimente", href: "/admin/events" },
    { icon: Users, label: "Utilizatori", href: "/admin/users" },
    { icon: FileText, label: "Cereri", href: "/admin/requests" },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      <AnimatedBackground />

      {/* Sidebar - Desktop */}
      <aside
        className={`dashboard-sidebar ${
          isCollapsed ? "collapsed" : "expanded"
        }`}
      >
        <div className="dashboard-sidebar-header">
          {!isCollapsed && (
            <Link to="/admin/dashboard" className="dashboard-sidebar-logo">
              <div className="dashboard-sidebar-logo-icon">
                <span>U</span>
              </div>
              <span className="dashboard-sidebar-logo-text">UNIfy Admin</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="dashboard-sidebar-toggle"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="dashboard-sidebar-nav">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`dashboard-nav-link ${
                    isActive(item.href) ? "active" : "inactive"
                  }`}
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="dashboard-sidebar-user">
          <div
            className={`dashboard-sidebar-user-info ${
              isCollapsed ? "centered" : ""
            }`}
          >
            <div className="dashboard-sidebar-user-avatar">
              <User size={20} />
            </div>
            {!isCollapsed && (
              <div className="dashboard-sidebar-user-details">
                <p className="dashboard-sidebar-user-name">Admin User</p>
                <p className="dashboard-sidebar-user-email">admin@unify.ro</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="dashboard-sidebar-logout" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Deconectare</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="dashboard-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`dashboard-mobile-sidebar ${isMobileMenuOpen ? "open" : ""}`}
      >
        <div className="dashboard-sidebar-header">
          <Link to="/admin/dashboard" className="dashboard-sidebar-logo">
            <div className="dashboard-sidebar-logo-icon">
              <span>U</span>
            </div>
            <span className="dashboard-sidebar-logo-text">UNIfy Admin</span>
          </Link>
        </div>
        <nav className="dashboard-sidebar-nav">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`dashboard-nav-link ${
                    isActive(item.href) ? "active" : "inactive"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <button
              className="dashboard-topbar-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-[#a78bfa]" />
              <span className="dashboard-topbar-title">Panou Administrare</span>
            </div>
          </div>
          <div className="dashboard-topbar-right relative">
            <button
              className="dashboard-topbar-notification"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell size={20} />
            </button>
            <AdminNotificationsModal
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
            <div className="dashboard-topbar-user-mobile">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* AICI SE RANDEAZĂ PAGINILE DIN INTERIORUL ADMINULUI */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
