import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";
import adminService from "./services/adminService"; // Asigură-te că importul e corect

interface UnifiedRequest {
  id: string | number;
  type: "account" | "event";
  title: string;
  date: string;
  status: string;
}

const AdminRequestsPage: React.FC = () => {
  const [stats, setStats] = useState({
    pendingAccounts: 0,
    pendingEvents: 0,
  });

  const [recentRequests, setRecentRequests] = useState<UnifiedRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funcția de fetch separată pentru a putea fi refolosită sau apelată la mount
  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Apelăm ambele endpoint-uri în paralel pentru eficiență
      const [organizers, events] = await Promise.all([
        adminService.getPendingOrganizers(),
        adminService.getPendingEvents(),
      ]);

      // 2. Actualizăm statisticile
      setStats({
        pendingAccounts: organizers.length,
        pendingEvents: events.length,
      });

      // 3. Normalizăm datele pentru a le afișa într-o listă unificată
      const normalizedOrganizers: UnifiedRequest[] = organizers.map(
        (org: any) => ({
          id: org.id_user || org.id, // Folosim id_user dacă există, altfel id
          type: "account",
          title: org.organization_name || org.email || "Cerere Organizator",
          date: org.created_at || new Date().toISOString(),
          status: "pending",
        })
      );

      const normalizedEvents: UnifiedRequest[] = events.map((evt: any) => ({
        id: evt.id_event || evt.id, // Folosim id_event dacă există
        type: "event",
        title: evt.title || evt.name || "Eveniment fără nume",
        date: evt.created_at || evt.date_start || new Date().toISOString(),
        status: evt.status || "pending",
      }));

      // 4. Combinăm listele și le sortăm descrescător după dată (cele mai noi primele)
      const combined = [...normalizedOrganizers, ...normalizedEvents].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setRecentRequests(combined);
    } catch (err: any) {
      console.error("Failed to fetch admin requests:", err);
      setError("Nu s-au putut încărca datele. Verifică conexiunea.");
    } finally {
      setIsLoading(false);
    }
  };

  // Efectul rulează o singură dată la montarea componentei
  useEffect(() => {
    fetchRequests();
  }, []);

  // Helper pentru afișarea timpului relativ (ex: "acum 2 ore")
  const timeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Dată invalidă";
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return "Chiar acum";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} ore`;
      const days = Math.floor(hours / 24);
      return `${days} zile`;
    } catch (e) {
      return "Dată necunoscută";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-white">
        <Loader2 className="animate-spin w-8 h-8 text-[#a78bfa]" />
      </div>
    );
  }

  return (
    <div className="text-white animate-fade-in p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Cereri și Aprobări
        </h1>
        <p className="text-white/60">
          Gestionează cererile de cont organizator și aprobările de evenimente
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 flex items-center justify-between shadow-lg hover:border-[#a78bfa]/40 transition-all">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">
              Cereri Conturi
            </p>
            <p className="text-3xl font-bold text-orange-400">
              {stats.pendingAccounts}
            </p>
          </div>
          <div className="p-4 rounded-full bg-orange-500/20">
            <Users size={32} className="text-orange-400" />
          </div>
        </div>

        <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 flex items-center justify-between shadow-lg hover:border-[#a78bfa]/40 transition-all">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">
              Cereri Evenimente
            </p>
            <p className="text-3xl font-bold text-red-400">
              {stats.pendingEvents}
            </p>
          </div>
          <div className="p-4 rounded-full bg-red-500/20">
            <Calendar size={32} className="text-red-400" />
          </div>
        </div>
      </div>

      {/* NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Link către Aprobare Conturi */}
        <Link
          to="/admin/requests/accounts"
          className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 hover:bg-[#1a1040]/80 hover:border-[#a78bfa]/50 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-all"></div>

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="p-3 rounded-xl bg-orange-500/20 group-hover:scale-110 transition-transform duration-300">
              <Users size={28} className="text-orange-400" />
            </div>
            <ChevronRight
              size={20}
              className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 relative z-10">
            Aprobare Conturi
          </h3>
          <p className="text-white/60 text-sm mb-4 relative z-10">
            Vezi lista și aprobă cererile pentru conturi noi de organizatori
          </p>
          <div className="flex items-center gap-2 relative z-10">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/20">
              {stats.pendingAccounts} în așteptare
            </span>
          </div>
        </Link>

        {/* Link către Aprobare Evenimente */}
        <Link
          to="/admin/requests/events"
          className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 hover:bg-[#1a1040]/80 hover:border-[#a78bfa]/50 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/20 transition-all"></div>

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="p-3 rounded-xl bg-red-500/20 group-hover:scale-110 transition-transform duration-300">
              <Calendar size={28} className="text-red-400" />
            </div>
            <ChevronRight
              size={20}
              className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 relative z-10">
            Aprobare Evenimente
          </h3>
          <p className="text-white/60 text-sm mb-4 relative z-10">
            Vezi lista și aprobă evenimentele noi sau modificate de organizatori
          </p>
          <div className="flex items-center gap-2 relative z-10">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/20">
              {stats.pendingEvents} în așteptare
            </span>
          </div>
        </Link>
      </div>

      {/* Recent Requests List */}
      <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <h2 className="text-lg font-bold text-white">Cereri Recente</h2>
          <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded-lg">
            Ultimele actualizări
          </span>
        </div>

        <div className="space-y-3">
          {recentRequests.length > 0 ? (
            recentRequests.slice(0, 10).map((request) => (
              <div
                key={`${request.type}-${request.id}`}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 ${
                      request.type === "account"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {request.type === "account" ? (
                      <Users size={20} />
                    ) : (
                      <Calendar size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm md:text-base group-hover:text-[#a78bfa] transition-colors">
                      {request.title}
                    </p>
                    <p className="text-xs text-white/50 flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          request.type === "account"
                            ? "bg-orange-400"
                            : "bg-red-400"
                        }`}
                      ></span>
                      {request.type === "account"
                        ? "Cerere cont organizator"
                        : "Cerere aprobare eveniment"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium text-white/40 whitespace-nowrap">
                    {timeAgo(request.date)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    În așteptare
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-white/20" />
              </div>
              <p className="text-white/60 font-medium">
                Nu există cereri recente în așteptare
              </p>
              <p className="text-white/30 text-sm mt-1">
                Toate solicitările au fost procesate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRequestsPage;
