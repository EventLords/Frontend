import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Eye, Search, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import adminService from "../services/adminService";

interface Event {
  id: number | string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  status: "active" | "pending" | "rejected" | "draft" | "completed";
  participants_count?: number;
}

const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("active");

  // Fetch inițial și la schimbarea filtrului de status pentru a asigura date "fresh"
  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // ✅ SENIOR FIX: Am adăugat adminService.getRejectedEvents() pentru a aduce și evenimentele respinse
      const [activeEvents, pendingEvents, rejectedEvents] = await Promise.all([
        adminService.getActiveEvents(),
        adminService.getPendingEvents(),
        adminService.getRejectedEvents(), // Această metodă trebuie să existe în adminService
      ]);

      const normalizedActive = (
        Array.isArray(activeEvents) ? activeEvents : []
      ).map((e: any) => ({
        ...e,
        status: "active",
      }));

      const normalizedPending = (
        Array.isArray(pendingEvents) ? pendingEvents : []
      ).map((e: any) => ({
        ...e,
        status: "pending",
      }));

      const normalizedRejected = (
        Array.isArray(rejectedEvents) ? rejectedEvents : []
      ).map((e: any) => ({
        ...e,
        status: "rejected",
      }));

      // Combinăm toate sursele de date
      const allData = [
        ...normalizedActive,
        ...normalizedPending,
        ...normalizedRejected,
      ];

      const mappedData: Event[] = allData.map((e: any) => ({
        id: e.id || e.id_event,
        title: e.title || e.name || "Eveniment fără titlu",
        date: e.date || e.date_start,
        location: e.location || "Locație nespecificată",
        organizer:
          e.organizer_name || e.users?.organization_name || e.users?.first_name
            ? `${e.users.first_name} ${e.users.last_name}`
            : e.users?.email
            ? e.users.email
            : "Organizator necunoscut",
        status: e.status,
        participants_count: e.participants_count || 0,
      }));

      // Sortăm descrescător după dată (cele mai recente primele)
      const sortedData = mappedData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setEvents(sortedData);
    } catch (error) {
      console.error("Eroare la încărcarea evenimentelor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logică de filtrare locală (Search + Status)
  useEffect(() => {
    let result = events;

    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(lowerTerm) ||
          event.location.toLowerCase().includes(lowerTerm) ||
          event.organizer.toLowerCase().includes(lowerTerm)
      );
    }
    setFilteredEvents(result);
  }, [searchTerm, statusFilter, events]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
            Activ
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
            În așteptare
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium border border-red-500/30">
            Respins
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium border border-gray-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="text-white p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestionare Evenimente</h1>
          <p className="text-white/60 text-sm">
            Vizualizează și moderează evenimentele din platformă
          </p>
        </div>
        <button
          onClick={fetchEvents}
          className="flex items-center gap-2 px-4 py-2 bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20 text-[#a78bfa] rounded-lg border border-[#a78bfa]/30 transition-all"
        >
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          Actualizează
        </button>
      </div>

      {/* Bară Căutare */}
      <div className="bg-[#1a1040]/60 backdrop-blur-sm p-4 rounded-xl border border-[#a78bfa]/20 mb-6">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            size={18}
          />
          <input
            type="text"
            placeholder="Caută evenimente după nume, organizator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0F1023] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#a78bfa] placeholder:text-white/30 transition-all"
          />
        </div>
      </div>

      {/* Tab-uri Status */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-1">
        {[
          { id: "active", label: "Active" },
          { id: "pending", label: "În așteptare" },
          { id: "rejected", label: "Respinse" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative
                 ${
                   statusFilter === tab.id
                     ? "text-white"
                     : "text-white/50 hover:text-white/80"
                 }
               `}
          >
            {tab.label}
            {statusFilter === tab.id && (
              <div className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-[#a78bfa]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tabel Evenimente */}
      <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-white/60 flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin mb-3"></div>
            Se încarcă evenimentele...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/60 text-xs uppercase tracking-wider bg-[#0F1023]/50">
                  <th className="p-4 font-medium">Eveniment</th>
                  <th className="p-4 font-medium">Dată & Locație</th>
                  <th className="p-4 font-medium">Organizator</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-medium text-white text-sm">
                          {event.title}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-white/80 flex items-center gap-1.5 mb-1">
                          <Calendar size={14} className="text-[#a78bfa]" />
                          {new Date(event.date).toLocaleDateString("ro-RO")}
                        </div>
                        <div className="text-xs text-white/50 flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span
                            className="truncate max-w-[150px]"
                            title={event.location}
                          >
                            {event.location}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-white/80">
                        {event.organizer}
                      </td>
                      <td className="p-4">{getStatusBadge(event.status)}</td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/admin/events/${event.id}`}
                          className="inline-flex items-center p-2 bg-white/5 hover:bg-[#a78bfa]/20 rounded-lg text-white/60 hover:text-[#a78bfa] transition-colors border border-white/5 hover:border-[#a78bfa]/30"
                          title="Vezi detalii"
                        >
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-12 text-center text-white/40 italic"
                    >
                      Nu au fost găsite evenimente{" "}
                      {statusFilter === "rejected"
                        ? "respinse"
                        : "pentru acest filtru"}
                      .
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsPage;
