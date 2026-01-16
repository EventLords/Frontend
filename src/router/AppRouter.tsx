import React, { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import {
  MainLayout,
  DashboardLayout,
  OrganizerLayout,
  StudentLayout,
} from "../layouts";
import {
  HomePage,
  AboutPage,
  EventsPage,
  AdminDashboardPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
} from "../pages";
import {
  OrganizerDashboard,
  CreateEventPage,
  EditEventPage,
  EventParticipantsPage,
} from "../features/organizer/pages";
import {
  StudentDashboard,
  EventDetailsPage,
  CalendarPage,
  FavoritesPage,
  MyEventsPage,
} from "../features/students/pages";
import {
  NotificationsPage,
  ProfilePage,
  SettingsPage,
} from "../features/users/pages";
import AdminUsersPage from "../features/admin/AdminUsersPage";
import AdminRequestsPage from "../features/admin/AdminRequestsPage";
import AdminSettingsPage from "../features/admin/AdminSettingsPage";
import OrgRequestsPage from "../features/admin/OrgRequestPage";
import EventApprovalPage from "../features/admin/EventApprovalPage"; // Ensure this import points to your admin details page
import AdminReportsPage from "../features/admin/pages/AdminReportsPage";
import AdminEventsPage from "../features/admin/pages/AdminEventsPage";
import AdminEventDetailsPage from "../features/admin/pages/AdminEventDetailsPage";
import StudentsInfoPage from "../pages/FooterPages/StudentsInfoPage";
import OrganizersInfoPage from "../pages/FooterPages/OrganizersInfoPage";
import GuidePage from "../pages/FooterPages/GuidePage";

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

const AppRouter: React.FC = () => {
  return (
    <>
      <ScrollToTop />
    <Routes>
      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/students" element={<StudentsInfoPage />} />
        <Route path="/organizers" element={<OrganizersInfoPage />} />
        <Route path="/guide" element={<GuidePage />} />
      </Route>

      {/* Organizer Layout */}
      <Route path="/organizer" element={<OrganizerLayout />}>
        <Route index element={<OrganizerDashboard />} />
        <Route path="dashboard" element={<OrganizerDashboard />} />
        <Route path="home" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="events" element={<OrganizerDashboard />} />
        <Route path="events/create" element={<CreateEventPage />} />
        <Route path="events/:eventId/edit" element={<EditEventPage />} />
        <Route
          path="events/:eventId/participants"
          element={<EventParticipantsPage />}
        />
        <Route path="participants" element={<OrganizerDashboard />} />
        <Route path="help" element={<OrganizerDashboard />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Student Layout */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="home" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="events" element={<StudentDashboard />} />
        <Route path="events/:eventId" element={<EventDetailsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="my-events" element={<MyEventsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Dashboard Layout */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="requests" element={<AdminRequestsPage />} />
        <Route path="requests/accounts" element={<OrgRequestsPage />} />
        <Route path="requests/events" element={<EventApprovalPage />} />
        <Route path="events/:eventId" element={<AdminEventDetailsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
};

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0F1023]">
    <div className="text-center">
      <h1 className="text-9xl font-display font-bold text-white mb-4">404</h1>
      <p className="text-xl text-white/60 mb-8">Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  </div>
);

export default AppRouter;
