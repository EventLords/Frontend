import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileCheck,
  Calendar,
  Bell,
  TrendingUp,
  Clock,
  Activity,
  AlertCircle,
  BarChart3,
  Zap,
  ArrowUpRight,
  UserPlus,
} from "lucide-react";

// ✅ Importurile serviciilor
import adminService from "../../features/admin/services/adminService";

interface DashboardActivity {
  id: string;
  type: "organizer_request" | "new_event";
  title: string;
  timestamp: string; // ISO date
  status: string;
}

const AdminDashboardPage: React.FC = () => {
  // State pentru date
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    pendingOrgRequests: 0,
    pendingEventApprovals: 0,
    newUsersThisWeek: 0,
    eventsThisMonth: 0,
    approvalRate: 0,
  });

  const [recentActivity, setRecentActivity] = useState<DashboardActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // 1. Facem request-uri paralele
      const [
        allUsersResponse,
        activeEventsResponse, // ✅ Schimbat: Acum luăm direct evenimentele active pentru Admin
        pendingOrganizers,
        pendingEvents,
      ] = await Promise.all([
        adminService.getUsers(),
        adminService.getActiveEvents(), // ✅ Apel corect către Admin API
        adminService.getPendingOrganizers(),
        adminService.getPendingEvents(),
      ]);

      // 2. Procesăm datele UTILIZATORILOR
      const allUsers = Array.isArray(allUsersResponse)
        ? allUsersResponse
        : (allUsersResponse as any)?.data || [];

      const usersCount = allUsers.length;

      // 3. Procesăm datele EVENIMENTELOR
      // Deoarece endpoint-ul returnează doar evenimente ACTIVE, nu mai e nevoie de filtrare complexă
      const activeEventsData = Array.isArray(activeEventsResponse)
        ? activeEventsResponse
        : (activeEventsResponse as any)?.data || [];

      const activeEventsCount = activeEventsData.length;

      const orgRequestsCount = pendingOrganizers.length;
      const eventApprovalsCount = pendingEvents.length;

      // --- Calculăm Statistici Temporale ---

      // "Noi săptămâna asta" (Users)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const newUsers = allUsers.filter(
        (u: any) =>
          u.created_at &&
          new Date(u.created_at).getTime() > oneWeekAgo.getTime()
      ).length;

      // "Evenimente luna asta" (folosind lista de evenimente active)
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const newEvents = activeEventsData.filter(
        (e: any) =>
          // Verificăm atât created_at cât și date_start/date
          (e.created_at &&
            new Date(e.created_at).getTime() > oneMonthAgo.getTime()) ||
          (e.date_start &&
            new Date(e.date_start).getTime() > oneMonthAgo.getTime()) ||
          (e.date && new Date(e.date).getTime() > oneMonthAgo.getTime())
      ).length;

      // Calculăm Rata de Aprobare
      // (Evenimente Active / (Evenimente Active + Respinse/Pending))
      const totalProcessed = activeEventsCount + eventApprovalsCount;
      const approvalRate =
        totalProcessed > 0
          ? Math.round((activeEventsCount / totalProcessed) * 100)
          : 100;

      setStats({
        totalUsers: usersCount,
        activeEvents: activeEventsCount,
        pendingOrgRequests: orgRequestsCount,
        pendingEventApprovals: eventApprovalsCount,
        newUsersThisWeek: newUsers,
        eventsThisMonth: newEvents,
        approvalRate: approvalRate,
      });

      // 4. Construim lista de "Activitate Recentă"
      const activities: DashboardActivity[] = [];

      // Adăugăm cereri organizatori recente
      pendingOrganizers.slice(0, 3).forEach((org: any) => {
        activities.push({
          id: `org-${org.id_user}`,
          type: "organizer_request",
          title: `Cerere cont: ${org.organization_name || org.email}`,
          timestamp: org.created_at || new Date().toISOString(),
          status: "pending",
        });
      });

      // Adăugăm evenimente noi ACTIVE (cele mai recente aprobate)
      const sortedEvents = [...activeEventsData].sort((a: any, b: any) => {
        const dateA = new Date(
          a.created_at || a.date_start || a.date
        ).getTime();
        const dateB = new Date(
          b.created_at || b.date_start || b.date
        ).getTime();
        return dateB - dateA;
      });

      sortedEvents.slice(0, 3).forEach((evt: any) => {
        activities.push({
          id: `evt-${evt.id || evt.id_event}`,
          type: "new_event",
          title: `Eveniment nou: ${evt.name || evt.title}`,
          timestamp:
            evt.created_at ||
            evt.date_start ||
            evt.date ||
            new Date().toISOString(),
          status: evt.status || "active",
        });
      });

      // Sortăm activitățile combinate
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error("Eroare la încărcarea datelor dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " ani";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " luni";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " zile";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " ore";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minute";
    return Math.floor(seconds) + " secunde";
  };

  const StatCard: React.FC<any> = ({
    title,
    value,
    icon,
    color,
    linkTo,
    subtitle,
  }) => (
    <Link
      to={linkTo || "#"}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl h-full overflow-hidden ${color}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-white/70">{title}</p>
          {subtitle && (
            <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-white/10 text-white/90 group-hover:bg-white/20 transition-colors">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between mt-4 relative z-10">
        <h3 className="text-3xl font-bold text-white">
          {isLoading ? "..." : value}
        </h3>
        <ArrowUpRight
          size={18}
          className="text-white/40 group-hover:text-white/70 transition-colors"
        />
      </div>
    </Link>
  );

  return (
    <div className="text-white animate-fade-in p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed]">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Panou Administrare
            </h1>
            <p className="text-white/60 text-sm">
              Privire de ansamblu asupra platformei
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-gradient-to-r from-[#1a1040]/80 to-[#2E1760]/60 backdrop-blur-sm rounded-2xl border border-[#a78bfa]/20 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-green-400" />
              <span className="font-bold text-green-400">
                +{stats.newUsersThisWeek}
              </span>
            </div>
            <span className="text-white/60 text-sm">
              Utilizatori noi săptămâna aceasta
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-blue-400" />
              <span className="font-bold text-blue-400">
                {stats.eventsThisMonth}
              </span>
            </div>
            <span className="text-white/60 text-sm">
              Evenimente luna aceasta
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-purple-400" />
              <span className="font-bold text-purple-400">
                {stats.approvalRate}%
              </span>
            </div>
            <span className="text-white/60 text-sm">Rată aprobare</span>
          </div>
        </div>
      </div>

      {/* Statistici Cheie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Utilizatori"
          value={stats.totalUsers}
          icon={<Users size={22} />}
          color="bg-gradient-to-br from-[#a78bfa]/30 to-[#7c3aed]/30 border border-[#a78bfa]/30"
          linkTo="/admin/users"
          subtitle="Studenți și organizatori"
        />
        <StatCard
          title="Evenimente Active"
          value={stats.activeEvents}
          icon={<Calendar size={22} />}
          color="bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-500/30"
          linkTo="/admin/events"
          subtitle="Vizibile public"
        />
        <StatCard
          title="Cereri Organizator"
          value={stats.pendingOrgRequests}
          icon={<FileCheck size={22} />}
          color="bg-gradient-to-br from-orange-500/30 to-amber-600/30 border border-orange-500/30"
          linkTo="/admin/requests/accounts"
          subtitle="În așteptare"
        />
        <StatCard
          title="Aprobări Evenimente"
          value={stats.pendingEventApprovals}
          icon={<Bell size={22} />}
          color="bg-gradient-to-br from-rose-500/30 to-red-600/30 border border-rose-500/30"
          linkTo="/admin/requests/events"
          subtitle="Necesită atenție"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activitate Recentă */}
        <div className="lg:col-span-2 bg-[#1a1040]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#a78bfa]/20">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#a78bfa]" />
              <h2 className="text-lg font-semibold">Activitate Recentă</h2>
            </div>
            <span className="text-xs text-white/40">
              Actualizat în timp real
            </span>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-4 text-white/40">
                Se încarcă activitatea...
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-4 text-white/40">
                Nicio activitate recentă.
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "organizer_request"
                          ? "bg-green-500/20"
                          : "bg-blue-500/20"
                      }`}
                    >
                      {activity.type === "organizer_request" ? (
                        <UserPlus size={18} className="text-green-400" />
                      ) : (
                        <Calendar size={18} className="text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-white/40">
                        Acum {timeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                  {activity.status === "pending" && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      În așteptare
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar - Acțiuni și Link Rapoarte */}
        <div className="space-y-6">
          <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#a78bfa]/20">
            <div className="flex items-center gap-2 mb-5">
              <Zap size={18} className="text-amber-400" />
              <h2 className="text-lg font-semibold">Acțiuni Rapide</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/admin/requests/accounts"
                className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-500/10 to-transparent rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="text-orange-400" />
                  <span className="font-medium">Aprobare Conturi</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-sm font-bold text-orange-400">
                  {stats.pendingOrgRequests}
                </span>
              </Link>
              <Link
                to="/admin/requests/events"
                className="flex justify-between items-center p-4 bg-gradient-to-r from-rose-500/10 to-transparent rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="text-rose-400" />
                  <span className="font-medium">Aprobare Evenimente</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-sm font-bold text-rose-400">
                  {stats.pendingEventApprovals}
                </span>
              </Link>
            </div>
          </div>

          {/* Link către Rapoarte */}
          <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#a78bfa]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#a78bfa]" />
                <h2 className="text-lg font-semibold">Rapoarte Detaliate</h2>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-6 relative z-10">
              Vezi analiza completă a evenimentelor, prezența studenților și
              topuri.
            </p>
            <Link
              to="/admin/reports" // Asigură-te că ruta există sau folosește un link valid
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#a78bfa] hover:bg-[#8b5cf6] text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 relative z-10"
            >
              <BarChart3 size={18} />
              Deschide Rapoarte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
