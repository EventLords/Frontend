import React, { useState, useEffect } from "react";
import { BarChart3, Calendar, Users, TrendingUp, Award, X } from "lucide-react";
import adminService, {
  EventsPerMonth,
  ParticipationStats,
  TopEventsData,
} from "../services/adminService"; // Asigură-te că importul e corect

const MONTH_LABELS_RO: Record<string, string> = {
  "01": "Ian",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "Mai",
  "06": "Iun",
  "07": "Iul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Noi",
  "12": "Dec",
};

const getMonthLabel = (monthStr: string): string => {
  const monthNum = monthStr.split("-")[1];
  return MONTH_LABELS_RO[monthNum] || monthNum;
};

const AdminReportsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Filtre
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [topSort, setTopSort] = useState<"registrations" | "checkedin">(
    "registrations"
  );

  // Date
  const [monthStats, setMonthStats] = useState<EventsPerMonth | null>(null);
  const [participationStats, setParticipationStats] =
    useState<ParticipationStats | null>(null);
  const [topEvents, setTopEvents] = useState<TopEventsData | null>(null);

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, topSort]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [months, participation, tops] = await Promise.all([
        adminService.getEventsPerMonth(
          dateFrom || undefined,
          dateTo || undefined
        ),
        adminService.getParticipationStats(
          dateFrom || undefined,
          dateTo || undefined
        ),
        adminService.getTopEvents(
          topSort,
          5,
          dateFrom || undefined,
          dateTo || undefined
        ),
      ]);

      setMonthStats(months);
      setParticipationStats(participation);
      setTopEvents(tops);
    } catch (error) {
      console.error("Eroare la încărcarea rapoartelor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMaxCount = () => {
    if (!monthStats?.data.length) return 1;
    // Specificăm tipul pentru 'd' pentru a elimina eroarea TS
    return Math.max(...monthStats.data.map((d: { count: number }) => d.count));
  };

  // Helper pentru butoane rapide
  const setQuickRange = (range: "today" | "week" | "month" | "year") => {
    const now = new Date();
    let start = new Date();

    if (range === "today") {
      start = now;
    } else if (range === "week") {
      const day = now.getDay() || 7;
      if (day !== 1) start.setHours(-24 * (day - 1));
    } else if (range === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === "year") {
      start = new Date(now.getFullYear(), 0, 1);
    }

    setDateFrom(start.toISOString().split("T")[0]);
    setDateTo(new Date().toISOString().split("T")[0]);
  };

  if (isLoading && !monthStats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-[#a78bfa]/30 border-t-[#a78bfa] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in text-white max-w-[1600px] mx-auto">
      {/* HEADER & CONTROL BAR */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Rapoarte & Analize
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Statistici detaliate despre activitatea platformei
          </p>
        </div>

        {/* PREMIUM FILTER BAR */}
        <div className="flex flex-col sm:flex-row gap-3 bg-[#1a1040]/50 backdrop-blur-md p-2 rounded-2xl border border-[#a78bfa]/20 shadow-lg">
          {/* Quick Actions */}
          <div className="flex p-1 bg-black/20 rounded-xl">
            <button
              onClick={() => setQuickRange("week")}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              Săpt
            </button>
            <button
              onClick={() => setQuickRange("month")}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              Lună
            </button>
            <button
              onClick={() => setQuickRange("year")}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              An
            </button>
          </div>

          <div className="h-8 w-[1px] bg-white/10 my-auto hidden sm:block"></div>

          {/* Date Pickers */}
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-black/20 hover:bg-black/30 border border-white/10 hover:border-[#a78bfa]/50 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#a78bfa]/20 transition-all w-36 cursor-pointer"
            />
            <span className="text-slate-500">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-black/20 hover:bg-black/30 border border-white/10 hover:border-[#a78bfa]/50 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#a78bfa]/20 transition-all w-36 cursor-pointer"
            />
          </div>

          {/* Reset Button */}
          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent rounded-xl transition-all"
              title="Resetează filtrele"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Evenimente"
          value={participationStats?.totalEvents || 0}
          icon={<Calendar className="text-[#c4b5fd]" size={24} />}
          color="from-purple-500/20 to-purple-600/5 border-purple-500/20"
        />
        <KpiCard
          title="Total Înscrieri"
          value={participationStats?.totalRegistrations || 0}
          icon={<Users className="text-blue-400" size={24} />}
          color="from-blue-500/20 to-blue-600/5 border-blue-500/20"
        />
        <KpiCard
          title="Prezență Medie"
          value={`${participationStats?.attendanceRate || 0}%`}
          icon={<TrendingUp className="text-green-400" size={24} />}
          color="from-green-500/20 to-green-600/5 border-green-500/20"
          desc="Rata de check-in"
        />
        <KpiCard
          title="Medie Participanți"
          value={participationStats?.avgCheckedInPerEvent || 0}
          icon={<Award className="text-orange-400" size={24} />}
          color="from-orange-500/20 to-orange-600/5 border-orange-500/20"
          desc="per eveniment"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART: EVENIMENTE PE LUNI */}
        <div className="bg-[#1a1040]/40 backdrop-blur-sm p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="text-[#a78bfa]" size={18} />
                Evoluție Evenimente
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Numărul de evenimente organizate pe lună
              </p>
            </div>
          </div>

          <div className="h-56 relative z-10">
            {monthStats?.data.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <BarChart3 size={32} className="mb-2 opacity-20" />
                Nu sunt date pentru perioada selectată
              </div>
            ) : (
              <div className="h-full flex items-end justify-center gap-6 px-4">
                {monthStats?.data.map((item: { month: string; count: number }) => {
                  const maxHeight = 180;
                  const barHeight = getMaxCount() > 0 
                    ? Math.max((item.count / getMaxCount()) * maxHeight, 8) 
                    : 8;
                  return (
                    <div
                      key={item.month}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      {/* Tooltip */}
                      <div className="mb-2 bg-[#0f0c29] border border-[#a78bfa]/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl whitespace-nowrap">
                        {item.count} evenimente
                      </div>
                      {/* Bar */}
                      <div
                        style={{ height: `${barHeight}px` }}
                        className="w-12 md:w-14 bg-gradient-to-t from-[#7c3aed] via-[#9061f9] to-[#c4b5fd] rounded-t-lg group-hover:from-[#8b5cf6] group-hover:to-[#d8b4fe] group-hover:shadow-[0_0_20px_rgba(167,139,250,0.6)] transition-all duration-300"
                      />
                      {/* Label */}
                      <span className="mt-3 text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                        {getMonthLabel(item.month)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* TOP EVENIMENTE TABLE */}
        <div className="bg-[#1a1040]/40 backdrop-blur-sm p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="text-yellow-400" size={18} />
                Top Performanță
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Cele mai populare evenimente
              </p>
            </div>

            <div className="flex bg-black/20 rounded-lg p-1 border border-white/5">
              <button
                onClick={() => setTopSort("registrations")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  topSort === "registrations"
                    ? "bg-[#a78bfa] text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Înscrieri
              </button>
              <button
                onClick={() => setTopSort("checkedin")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  topSort === "checkedin"
                    ? "bg-[#a78bfa] text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Prezență
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto relative z-10">
            {topEvents?.data.length === 0 ? (
              <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                <Award size={32} className="mb-2 opacity-20" />
                Nu există evenimente în top
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="text-slate-500 border-b border-white/5 text-xs uppercase tracking-wider">
                    <th className="pb-3 pl-2 font-medium">Titlu</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">
                      Dată
                    </th>
                    <th className="pb-3 font-medium text-right pr-2">
                      {topSort === "registrations" ? "Înscriși" : "Prezenți"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topEvents?.data.map((event: any, index: number) => (
                    <tr
                      key={event.id_event}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold shadow-md
                            ${
                              index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black"
                                : index === 1
                                ? "bg-gradient-to-br from-slate-300 to-slate-400 text-black"
                                : index === 2
                                ? "bg-gradient-to-br from-orange-700 to-orange-800 text-white"
                                : "bg-white/10 text-slate-400"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate max-w-[140px] sm:max-w-[200px] group-hover:text-[#a78bfa] transition-colors">
                              {event.title}
                            </p>
                            <p className="text-[10px] text-slate-500 sm:hidden">
                              {new Date(event.date_start).toLocaleDateString(
                                "ro-RO"
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-400 text-xs hidden sm:table-cell">
                        {new Date(event.date_start).toLocaleDateString("ro-RO")}
                      </td>
                      <td className="py-3 text-right font-bold text-white pr-2">
                        {topSort === "registrations"
                          ? event.registrationsCount
                          : event.checkedInCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentă mică pentru cardurile de sus
const KpiCard = ({ title, value, icon, color, desc }: any) => (
  <div
    className={`p-5 rounded-3xl bg-gradient-to-br ${color} border backdrop-blur-sm flex items-center justify-between shadow-lg relative overflow-hidden group`}
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>

    <div className="relative z-10">
      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1 opacity-80">
        {title}
      </p>
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>

      {desc && (
        <p className="text-xs text-slate-400 mt-1 font-medium">{desc}</p>
      )}
    </div>

    <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
      {icon}
    </div>
  </div>
);

export default AdminReportsPage;
