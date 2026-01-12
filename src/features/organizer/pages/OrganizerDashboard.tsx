import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  FileText,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Archive,
  Search,
  RefreshCw,
  Send, // ✅ Adăugat pentru butonul de trimitere
} from "lucide-react";
import eventsService from "../services/eventsService";
import { Event, DashboardStats } from "../../../types/organizer";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ArchiveConfirmationModal from "../components/ArchiveConfirmationModal";
import AnimatedBackground from "../../../components/AnimatedBackground";

import "./OrganizerDashboard.css";

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    activeEvents: 0,
    totalParticipants: 0,
    uploadedMaterials: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null); // ✅ State pentru loading la trimitere

  // --- MODAL STATES ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [eventToArchive, setEventToArchive] = useState<Event | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const navigate = useNavigate();

  // --- FETCHING DATA ---
  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await eventsService.getOrganizerDashboard();
      const fetchedEvents = data.events || [];
      setEvents(fetchedEvents);

      const calculatedTotalParticipants = fetchedEvents.reduce(
        (acc: number, ev: Event) => acc + (ev.currentParticipants || 0),
        0
      );

      setStats({
        ...data.stats,
        totalParticipants: calculatedTotalParticipants,
        activeEvents: fetchedEvents.filter((e) => e.status === "active").length,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredEvents = normalizedQuery
    ? events.filter((ev) => {
        const haystack = `${ev.name ?? ""} ${(ev as any).title ?? ""} ${(ev as any).description ?? ""}`
          .toLowerCase()
          .trim();
        return haystack.includes(normalizedQuery);
      })
    : events;

  useEffect(() => {
    fetchDashboard();
  }, []);

  // --- ACTIONS ---

  // ✅ FUNCȚIE NOUĂ: Trimite spre admin
  const handleSendToAdmin = async (eventId: number) => {
    setSubmittingId(eventId);
    try {
      await eventsService.submitEvent(eventId);

      // Actualizăm statusul local fără a reîncărca tot dashboard-ul
      setEvents((prev) =>
        prev.map((ev) =>
          Number(ev.id) === eventId ? { ...ev, status: "pending" as any } : ev
        )
      );
    } catch (err: any) {
      console.error("Eroare la trimitere:", err);
      alert("Nu s-a putut trimite evenimentul spre aprobare.");
    } finally {
      setSubmittingId(null);
    }
  };

  const initiateDelete = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await eventsService.deleteEvent(Number(eventToDelete.id));
      const updatedEvents = events.filter((e) => e.id !== eventToDelete.id);
      setEvents(updatedEvents);
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (err: any) {
      console.error("Eroare la ștergere", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const initiateArchive = (event: Event) => {
    setEventToArchive(event);
    setIsArchiveModalOpen(true);
  };

  const confirmArchive = async () => {
    if (!eventToArchive) return;
    setIsArchiving(true);
    try {
      await eventsService.archiveEvent(Number(eventToArchive.id));
      const updatedEvents = events.map((e) =>
        e.id === eventToArchive.id ? { ...e, status: "inactive" as const } : e
      );
      setEvents(updatedEvents);
      setIsArchiveModalOpen(false);
      setEventToArchive(null);
    } catch (err) {
      console.error("Eroare la arhivare:", err);
    } finally {
      setIsArchiving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wide">
            Activ
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wide">
            În așteptare
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wide">
            Respins
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase tracking-wide">
            Ciornă
          </span>
        );
      case "inactive":
      case "archived":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-600/20 text-slate-400 border border-slate-600/30 uppercase tracking-wide">
            Inactiv
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 uppercase tracking-wide">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen text-white font-sans relative">
      <AnimatedBackground />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        eventName={eventToDelete?.name || "acest eveniment"}
        isDeleting={isDeleting}
      />

      <ArchiveConfirmationModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={confirmArchive}
        eventName={eventToArchive?.name || "acest eveniment"}
        isArchiving={isArchiving}
      />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">
              Panou de Control
            </div>
            <h1 className="text-3xl font-bold text-white uni-title">
              Gestionează-ți evenimentele
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchDashboard}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 text-slate-300 hover:text-white"
            >
              <RefreshCw
                size={20}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <Link
              to="/organizer/events/create"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c4b5fd] via-[#a78bfa] to-[#8b5cf6] hover:from-[#a78bfa] hover:to-[#7c3aed] transition-all rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30 active:scale-95 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Eveniment Nou
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard
            icon={<Calendar className="text-[#8B5CF6]" size={24} />}
            label="Evenimente active"
            value={stats.activeEvents}
            subtext="în desfășurare"
          />
          <StatCard
            icon={<Users className="text-[#8B5CF6]" size={24} />}
            label="Participanți total"
            value={stats.totalParticipants}
            subtext="în toate evenimentele"
          />
          <StatCard
            icon={<FileText className="text-[#8B5CF6]" size={24} />}
            label="Materiale încărcate"
            value={stats.uploadedMaterials}
            subtext="fișiere disponibile"
          />
        </div>

        {/* Events List */}
        <div className="bg-[#151632] rounded-2xl border border-slate-800/60 overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Evenimentele Mele
              <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full ml-2">
                {filteredEvents.length}
              </span>
            </h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Caută eveniment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0F1023] border border-slate-700 text-sm rounded-lg pl-9 pr-4 py-2 text-slate-300 focus:outline-none focus:border-purple-500 w-64"
              />
            </div>
          </div>

          <div className="flex flex-col max-h-[440px] overflow-y-auto scrollbar-dark">
            {isLoading ? (
              <div className="p-12 text-center text-slate-500 animate-pulse">
                Se încarcă datele...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                <Calendar size={48} className="mb-4 opacity-20" />
                {normalizedQuery ? (
                  <p className="text-lg mb-2">
                    Nu există rezultate pentru "{searchQuery.trim()}".
                  </p>
                ) : (
                  <>
                    <p className="text-lg mb-2">
                      Nu ai niciun eveniment creat momentan.
                    </p>
                    <Link
                      to="/organizer/events/create"
                      className="text-[#8B5CF6] hover:text-[#A78BFA] font-medium"
                    >
                      Creează primul eveniment
                    </Link>
                  </>
                )}
              </div>
            ) : (
              filteredEvents.map((event) => {
                const isActive = event.status === "active";
                const isDraft = event.status === "draft";
                const participantCount = event.currentParticipants || 0;

                return (
                  <div
                    key={event.id}
                    className="group flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 border-b border-slate-800/50 hover:bg-[#1E1E40]/80 hover:border-l-4 hover:border-l-purple-500 transition-all duration-200 last:border-b-0"
                  >
                    <div className="mb-4 lg:mb-0 w-full lg:w-auto">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {event.name}
                        </h3>
                        {getStatusBadge(event.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded">
                          <Calendar size={14} className="text-slate-500" />
                          {new Date(event.date).toLocaleDateString("ro-RO")}
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded">
                          <Users size={14} className="text-slate-500" />
                          <span className="font-bold text-white">
                            {participantCount}
                          </span>{" "}
                          participanți
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:min-w-[420px] lg:justify-end">
                      {/* ✅ BUTON NOU: Apare doar pentru DRAFT */}
                      {isDraft && (
                        <button
                          onClick={() => handleSendToAdmin(Number(event.id))}
                          disabled={submittingId === Number(event.id)}
                          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-all text-sm font-bold border border-emerald-500/30"
                        >
                          {submittingId === Number(event.id) ? (
                            <RefreshCw size={18} className="animate-spin shrink-0" />
                          ) : (
                            <Send size={18} className="shrink-0" />
                          )}
                          Trimite la Admin
                        </button>
                      )}

                      <button
                        onClick={() =>
                          navigate(`/organizer/events/${event.id}/participants`)
                        }
                        className="w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2D2D55] text-slate-200 hover:bg-[#3D3D6B] hover:text-white hover:scale-105 transition-all text-sm font-medium border border-slate-700 shadow-sm"
                      >
                        <Eye size={18} className="shrink-0" /> Detalii
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/organizer/events/${event.id}/edit`)
                        }
                        className="w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2D2D55] text-slate-200 hover:bg-[#3D3D6B] hover:text-white hover:scale-105 transition-all text-sm font-medium border border-slate-700 shadow-sm"
                      >
                        <Edit3 size={18} className="shrink-0" /> Editare
                      </button>

                      {isActive ? (
                        <button
                          onClick={() => initiateArchive(event)}
                          className="w-[110px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:scale-105 transition-all text-sm font-medium border border-orange-500/20"
                        >
                          <Archive size={18} className="shrink-0" /> Finalizare
                        </button>
                      ) : (
                        <button
                          onClick={() => initiateDelete(event)}
                          className="w-[110px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all text-sm font-medium border border-red-500/20"
                        >
                          <Trash2 size={18} className="shrink-0" /> Șterge
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext }: any) => (
  <div className="bg-[#1E1E40] p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-purple-500/40 hover:shadow-purple-500/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20"></div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4 text-slate-400 font-medium">
        <div className="p-2 bg-[#2D2D55] rounded-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {label}
      </div>
      <div className="flex items-end gap-2">
        <div className="text-4xl font-bold text-white tracking-tight">
          {value}
        </div>
        {subtext && (
          <div className="text-xs text-slate-500 mb-1.5 font-medium">
            {subtext}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default OrganizerDashboard;
