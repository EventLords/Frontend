import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  Info,
  ChevronRight,
} from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";
import { ro } from "date-fns/locale";
import "./CalendarPage.css";

import { StudentEvent } from "../../../types/student";
import EventCalendar from "../components/EventCalendar";
import eventsApiService from "../../../services/eventsApiService";
import { enrollmentService } from "../services/enrollmentService";

// ✅ Helper pentru construirea URL-ului corect al imaginii
const getFileUrl = (path: string | undefined) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  // Construim URL-ul complet folosind variabila de mediu sau fallback
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  const serverRoot = apiBase.replace("/api", "");
  const cleanPath = path.replace(/\\/g, "/").split("uploads/").pop();

  return `${serverRoot}/uploads/${cleanPath}`;
};

const EventCard: React.FC<{ event: StudentEvent; variant: "compact" }> = ({
  event,
}) => {
  const eventDateObj = event.date ? parseISO(event.date) : new Date();

  const organizerName =
    typeof event.organizer === "string"
      ? event.organizer
      : event.organizer?.name || "Organizator";

  // Gestionare imagine
  const rawImage =
    (event as any).imageUrl || event.files?.[0]?.file_path || event.image;
  const imageUrl = getFileUrl(rawImage);
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/student/events/${event.id}`}
      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 group animate-in fade-in slide-in-from-right-4 duration-300"
    >
      {/* Zona Imagine / Icoană */}
      <div className="flex-shrink-0 text-center w-12">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={event.name}
            onError={() => setImgError(true)}
            className="w-12 h-12 rounded-lg object-cover mx-auto mb-1 border border-white/10 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[#6366f1]/20 flex items-center justify-center mx-auto mb-1 border border-white/5">
            <Calendar
              size={20}
              className={event.isEnrolled ? "text-green-400" : "text-[#818cf8]"}
            />
          </div>
        )}
        <span className="text-[10px] text-white/60 font-medium block leading-tight mt-1">
          {format(eventDateObj, "HH:mm")}
        </span>
      </div>

      {/* Detalii Eveniment */}
      <div className="flex-grow min-w-0 pt-0.5 ml-1">
        <p className="font-semibold text-white text-sm line-clamp-2 group-hover:text-[#c4b5fd] transition-colors leading-snug">
          {event.name || event.title}
        </p>
        <div className="text-xs text-white/50 space-y-1 mt-1.5">
          <div className="flex items-center gap-1.5">
            <MapPin size={11} className="text-white/40" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={11} className="text-white/40" />
            <span className="truncate">{organizerName}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col items-end justify-between h-full gap-2 pl-2">
        {event.isEnrolled && (
          <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-medium tracking-wide">
            Înscris
          </span>
        )}
        <ChevronRight
          size={16}
          className="text-white/30 group-hover:text-white transition-colors mt-auto"
        />
      </div>
    </Link>
  );
};

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [enrolledEvents, setEnrolledEvents] = useState<StudentEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "enrolled">("all");

  const mapBackendEventToFrontend = (backendEvent: any): StudentEvent => {
    return {
      id: String(backendEvent.id_event),
      title: backendEvent.title || backendEvent.name || "Eveniment",
      name: backendEvent.title || backendEvent.name || "Eveniment",
      description: backendEvent.description || "",
      date: backendEvent.date_start,
      time: backendEvent.date_start 
        ? new Date(backendEvent.date_start).toLocaleTimeString("ro-RO", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Europe/Bucharest",
          })
        : "N/A",
      location: backendEvent.location || "Locație necunoscută",
      organizer: backendEvent.users?.organization_name || "Organizator",
      category: backendEvent.type?.name || "altele",
      // Mapăm fișierele pentru a extrage imaginea corect
      imageUrl: backendEvent.files?.[0]?.file_path || "",
      image: backendEvent.files?.[0]?.file_path || "",
      files: backendEvent.files,
      isEnrolled: false,
      maxParticipants: (backendEvent.max_participants ?? backendEvent.maxParticipants ?? 0) as number,
      currentParticipants: backendEvent.current_participants || 0,
      faculty: backendEvent.faculties?.name || "",
      tags: [],
    } as unknown as StudentEvent;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const eventsData = await eventsApiService.listActiveEvents();
        const myRegistrations = await enrollmentService.getMyEnrollments();
        const myRegisteredEventIds = new Set(
          myRegistrations.map((r: any) => String(r.event_id))
        );

        const mappedEvents: StudentEvent[] = eventsData.map((e: any) => {
          const mapped = mapBackendEventToFrontend(e);
          return { ...mapped, isEnrolled: myRegisteredEventIds.has(mapped.id) };
        });

        setEvents(mappedEvents);
        setEnrolledEvents(mappedEvents.filter((e) => e.isEnrolled));
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const displayEvents = viewMode === "enrolled" ? enrolledEvents : events;

  const eventsOnSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return displayEvents.filter((event) =>
      isSameDay(parseISO(event.date), selectedDate)
    );
  }, [selectedDate, displayEvents]);

  const upcomingEnrolledEvents = enrolledEvents
    .filter((event) => {
      const eventDate = parseISO(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Calendar Evenimente
            </h1>
            <Link
              to="/student/dashboard"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10"
            >
              <ArrowLeft size={14} /> <span>Înapoi</span>
            </Link>
          </div>
          <p className="text-white/60">Organizează-ți timpul eficient</p>
        </div>

        {/* Toggle View Mode */}
        <div className="flex items-center gap-1 bg-[#1a1040]/60 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              viewMode === "all"
                ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Toate
          </button>
          <button
            onClick={() => setViewMode("enrolled")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              viewMode === "enrolled"
                ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Înscrise
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-3 border-white/10 border-t-[#6366f1] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* CALENDAR WIDGET */}
          <div className="xl:col-span-2">
            <EventCalendar
              events={displayEvents}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* SIDEBAR DETAILS */}
          <div className="space-y-4">
            {/* Evenimente Zi Selectată */}
            <div className="bg-[#1a1040]/40 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-xl min-h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <h2 className="font-semibold text-white flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#6366f1]/20 text-[#818cf8]">
                    <Calendar size={18} />
                  </div>
                  {format(selectedDate, "d MMMM yyyy", { locale: ro })}
                </h2>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-white/50 border border-white/5">
                  {eventsOnSelectedDay.length} evenimente
                </span>
              </div>

              {eventsOnSelectedDay.length === 0 ? (
                <div className="text-center py-12 flex-grow flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <Info size={20} className="text-white/30" />
                  </div>
                  <p className="text-white/60 text-sm font-medium">
                    Niciun eveniment
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    Nu există evenimente{" "}
                    {viewMode === "enrolled" ? "înscrise" : "programate"} pentru
                    această zi.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar pr-1">
                  {eventsOnSelectedDay.map((event) => (
                    <EventCard key={event.id} event={event} variant="compact" />
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Enrolled (Quick Access) */}
            {upcomingEnrolledEvents.length > 0 && (
              <div className="bg-[#1a1040]/40 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                  <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                    Urmează curând
                  </h2>
                </div>
                <div className="space-y-3">
                  {upcomingEnrolledEvents.slice(0, 2).map((event) => (
                    <EventCard key={event.id} event={event} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* ✅ ZONA DE SUMAR A FOST ELIMINATĂ DE AICI */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
