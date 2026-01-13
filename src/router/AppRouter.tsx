import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout, DashboardLayout, OrganizerLayout, StudentLayout } from '../layouts';
import { 
  HomePage, 
  AboutPage, 
  EventsPage,
  AdminDashboardPage, 
  LoginPage,
  RegisterPage,
  ForgotPasswordPage 
} from '../pages';
import {
  OrganizerDashboard,
  CreateEventPage,
  EditEventPage,
  EventParticipantsPage
} from '../features/organizer/pages';
import {
  StudentDashboard,
  EventDetailsPage,
  CalendarPage
} from '../features/students/pages';
import {
  NotificationsPage,
  ProfilePage,
  SettingsPage
} from '../features/users/pages';

// 🛑 Importul paginii Evenimentele Mele
import MyEventsPage from '@/features/students/pages/MyEventsPage';

// 🛑 Importurile paginilor de Admin Cereri (Adăugate)
// Presupunem că sunt în '../features/admin/pages' sau similar.
import OrgRequestsPage from '../features/admin/pages/OrgRequestPage'; 
import EventApprovalPage from '../features/admin/pages/EventApprovalPage';


const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Auth Pages - No Layout */}
      <Route path="/autentificare" element={<LoginPage />} />
      <Route path="/inregistrare" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/despre-noi" element={<AboutPage />} />
        <Route path="/evenimente" element={<EventsPage />} />
      </Route>

      {/* Organizer Layout Routes */}
      <Route path="/organizer" element={<OrganizerLayout />}>
        <Route index element={<OrganizerDashboard />} />
        <Route path="dashboard" element={<OrganizerDashboard />} />
        <Route path="events" element={<OrganizerDashboard />} />
        <Route path="events/create" element={<CreateEventPage />} />
        <Route path="events/:eventId/edit" element={<EditEventPage />} />
        <Route path="events/:eventId/participants" element={<EventParticipantsPage />} />
        <Route path="participants" element={<OrganizerDashboard />} />
        <Route path="help" element={<OrganizerDashboard />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Student Layout Routes (Modificat) */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="events" element={<StudentDashboard />} />
        
        {/* RUTA EXISTENTĂ: Detalii Eveniment */}
        <Route path="events/:eventId" element={<EventDetailsPage />} />
        
        {/* 🛑 RUTA ADĂUGATĂ: Evenimentele Mele */}
        <Route path="evenimentele-mele" element={<MyEventsPage />} />
        
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />

      </Route>

      {/* Admin Dashboard Layout Routes (Modificat) */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminDashboardPage />} />
        
        {/* 🛑 RUTA ADĂUGATĂ: Cereri Cont Organizator */}
        <Route path="cereri/organizator" element={<OrgRequestsPage />} />
        
        {/* 🛑 RUTA ADĂUGATĂ: Cereri Evenimente */}
        <Route path="cereri/evenimente" element={<EventApprovalPage />} />
        
        <Route path="evenimente" element={<AdminDashboardPage />} /> {/* Placeholder */}
        <Route path="utilizatori" element={<AdminDashboardPage />} /> {/* Placeholder */}
        <Route path="cereri" element={<AdminDashboardPage />} /> {/* Placeholder */}
        <Route path="setari" element={<AdminDashboardPage />} /> {/* Placeholder */}
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Simple 404 Page
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#DFF3E4] to-[#504C8C]">
      <div className="text-center">
        <h1 className="text-9xl font-display font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white/80 mb-8">Pagina nu a fost găsită</p>
        <a
          href="/"
          className="px-6 py-3 bg-white text-unify-purple font-medium rounded-xl hover:bg-unify-mint transition-colors"
        >
          Înapoi acasă
        </a>
      </div>
      </div>
  );
};

export default AppRouter;