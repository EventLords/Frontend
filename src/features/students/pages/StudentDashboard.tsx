import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Calendar,
  TrendingUp,
  Clock,
  Award,
  Search,
  RefreshCw,
} from "lucide-react";

import { EventFilters, EventCard } from "../components";
import { studentEventsService } from "../services/eventsService";
import { enrollmentService } from "../services/enrollmentService";
import {
  StudentEvent,
  EventFilters as FilterType,
} from "../../../types/student";
import { mapApiEventToStudentEvent } from "../services/event.mapper";

import "./StudentDashboard.css";

const StudentDashboard: React.FC = () => {
  const [filteredEvents, setFilteredEvents] = useState<StudentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [displayCount, setDisplayCount] = useState(6);

  const showEnrolledOnly = searchParams.get("enrolled") === "true";

  const [filters, setFilters] = useState<FilterType>({
    search: "",
    category: "all",
    period: "upcoming",
    location: "",
    faculty: "",
  });

  const [stats, setStats] = useState({
    enrolledEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalHours: 0,
  });

  /**
   * ✅ LOGICĂ SENIOR: Mapare unitară pentru imagini și date
   * Ne asigurăm că ambele tab-uri (Descoperă și Înscrise) trec prin mapper-ul oficial
   * care reconstruiește URL-ul imaginii de pe server (port 3001).
   */
  const getEventsData = useCallback(async (): Promise<StudentEvent[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (showEnrolledOnly) {
      try {
        const enrollments = await enrollmentService.getMyEnrollments();
        return enrollments
          .map((enr: any) => {
            const rawEvent = enr.events || enr.event;
            if (!rawEvent) return null;

            // ✅ Mapăm înscrierea pentru a extrage imaginea/categoria corect din files[]
            const mapped = mapApiEventToStudentEvent(rawEvent);
            return { ...mapped, isEnrolled: true } as StudentEvent;
          })
          .filter((e): e is StudentEvent => e !== null);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        return [];
      }
    } else {
      try {
        // ✅ getAllEvents returnează evenimentele (asigură-te că API-ul include clauza 'files')
        const events = await studentEventsService.getAllEvents(filters);

        // Filtrare defensivă pentru a nu afișa evenimente expirate
        return events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= today;
        });
      } catch (error) {
        console.error("Error fetching events:", error);
        return [];
      }
    }
  }, [filters, showEnrolledOnly]);

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [events, realStats] = await Promise.all([
          getEventsData(),
          studentEventsService.getDashboardStats(),
        ]);

        if (isMounted) {
          setFilteredEvents(events);
          if (realStats) setStats(realStats);
        }
      } catch (error) {
        console.error("Critical dashboard load error:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [getEventsData, showEnrolledOnly]);

  useEffect(() => {
    setDisplayCount(6);
  }, [filters, showEnrolledOnly]);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    suffix?: string;
    color: string;
  }> = ({ icon, label, value, suffix, color }) => (
    <div
      className={`${color} rounded-xl p-4 border border-white/10 transition-transform hover:scale-105 shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
        <div>
          <p className="text-2xl font-bold text-white">
            {value}
            <span className="text-lg font-medium ml-1">{suffix}</span>
          </p>
          <p className="text-sm text-white/60">{label}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 uni-title">
            {showEnrolledOnly ? "Evenimentele Mele" : "Descoperă evenimente"}
          </h1>
          <p className="text-white/60">
            {showEnrolledOnly
              ? "Lista evenimentelor la care ești înscris (istoric complet)"
              : "Găsește și înscrie-te la evenimentele universitare viitoare"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/student/calendar"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 transition-all"
          >
            <Calendar size={16} /> Vezi calendarul
          </Link>
          <Link
            to={
              showEnrolledOnly
                ? "/student/dashboard"
                : "/student/dashboard?enrolled=true"
            }
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              showEnrolledOnly
                ? "bg-[#a78bfa]/20 border border-[#a78bfa]/50 text-[#c4b5fd]"
                : "bg-white/5 border border-white/10 text-white/80"
            }`}
          >
            <Award size={16} />
            {showEnrolledOnly ? "Toate evenimentele" : "Evenimentele mele"}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Calendar size={20} className="text-blue-400" />}
          label="Înscris la"
          value={stats.enrolledEvents}
          suffix=" evenimente"
          color="bg-blue-500/10"
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-green-400" />}
          label="Viitoare"
          value={stats.upcomingEvents}
          suffix=" evenimente"
          color="bg-green-500/10"
        />
        <StatCard
          icon={<Award size={20} className="text-purple-400" />}
          label="Completate"
          value={stats.completedEvents}
          suffix=" evenimente"
          color="bg-purple-500/10"
        />
        <StatCard
          icon={<Clock size={20} className="text-orange-400" />}
          label="Total ore"
          value={stats.totalHours}
          suffix="h"
          color="bg-orange-500/10"
        />
      </div>

      <div className="mb-8">
        <EventFilters
          filters={filters}
          onFilterChange={setFilters}
          resultsCount={filteredEvents.length}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-12 h-12 text-[#a78bfa] animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <Search size={48} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/60">Nu s-au găsit evenimente active.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.slice(0, displayCount).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                variant="default" // ✅ DESIGN UNITAR: Card complet cu imagine peste tot
              />
            ))}
          </div>

          {filteredEvents.length > displayCount && (
            <div className="mt-12 text-center">
              <button
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all"
                onClick={() => setDisplayCount((prev) => prev + 6)}
              >
                Vezi mai multe evenimente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
