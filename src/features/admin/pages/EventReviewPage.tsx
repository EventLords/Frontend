import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  Tag,
  Info,
  Loader,
  AlertTriangle,
} from "lucide-react";
import eventsService from "../../../services/eventsService";

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  category: string;
  imageUrl?: string;
  participantsCount: number;
  maxParticipants: number;
  status: string;
  submissionDate?: string;
}

const EventReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEventData(eventId);
    }
  }, [eventId]);

  const fetchEventData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // API Call
      const data: any = await eventsService.getEvent(id);

      // ✅ Safety check: Ensure data exists before accessing properties
      if (!data || !data.id_event) {
        throw new Error("Date invalide primite de la server");
      }

      const mappedEvent: EventDetail = {
        id: data.id_event.toString(),
        title: data.title || data.name || "Fără titlu",
        description: data.description || "Nu există descriere.",
        date: data.date_start,
        time: data.time_start || (data.date_start 
          ? new Date(data.date_start).toLocaleTimeString("ro-RO", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Europe/Bucharest",
            })
          : "N/A"),
        location: data.location || "Online / Nespecificat",
        organizerName:
          data.organizer_name ||
          data.users?.organization_name ||
          (data.users
            ? `${data.users.first_name} ${data.users.last_name}`
            : "Organizator"),
        organizerEmail: data.users?.email || "N/A",
        category: data.event_types?.name || data.category || "General",
        imageUrl: data.image_url,
        participantsCount: data.currentParticipants || 0,
        maxParticipants: (data.max_participants ?? data.maxParticipants ?? 0) as number,
        status: data.status,
        submissionDate: data.created_at,
      };

      setEvent(mappedEvent);
    } catch (err) {
      console.error("Failed to fetch event details", err);
      setError(
        "Nu s-a putut încărca evenimentul. Este posibil să fi fost șters sau ID-ul este greșit."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "General";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F1023]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#a78bfa] animate-spin mx-auto mb-4" />
          <p className="text-white/60">Se încarcă detaliile...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F1023] p-4">
        <AlertTriangle size={48} className="text-amber-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Eroare</h2>
        <p className="text-white/60 mb-6">
          {error || "Evenimentul nu a fost găsit."}
        </p>
        <button
          onClick={() => navigate("/admin/events")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
        >
          <ArrowLeft size={18} /> Înapoi la listă
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1023] text-white p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Previzualizare Eveniment
          </h1>
          <button
            onClick={() => navigate("/admin/events")}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Înapoi</span>
          </button>
        </div>

        <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-3xl border border-[#a78bfa]/20 overflow-hidden shadow-2xl">
          <div className="relative h-64 md:h-80 w-full bg-slate-800">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1040] to-[#2E1760]">
                <Calendar size={64} className="text-white/10 mb-4" />
                <p className="text-white/20 font-medium">
                  Fără imagine de copertă
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1023] via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-6 left-6 md:left-10 right-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-[#a78bfa]/90 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-lg">
                  {getCategoryLabel(event.category)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg ${
                    event.status === "active"
                      ? "bg-green-500/90 text-white"
                      : event.status === "pending"
                      ? "bg-yellow-500/90 text-black"
                      : "bg-slate-500/90 text-white"
                  }`}
                >
                  {event.status === "active"
                    ? "Publicat"
                    : event.status === "pending"
                    ? "În așteptare"
                    : event.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Info size={20} className="text-[#a78bfa]" /> Descriere
                </h2>
                <div className="text-white/70 leading-relaxed whitespace-pre-line text-base bg-white/5 p-6 rounded-2xl border border-white/5">
                  {event.description}
                </div>
              </div>
              <div className="bg-[#1a1040] rounded-2xl p-6 border border-white/10">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User size={20} className="text-[#a78bfa]" /> Organizator
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {event.organizerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">
                      {event.organizerName}
                    </p>
                    <p className="text-sm text-white/60">
                      {event.organizerEmail}
                    </p>
                    {event.submissionDate && (
                      <p className="text-xs text-white/40 mt-1">
                        Trimis la:{" "}
                        {new Date(event.submissionDate).toLocaleDateString(
                          "ro-RO"
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6 sticky top-8">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3 mb-4">
                  Detalii Cheie
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-[#a78bfa]/20 rounded-xl text-[#a78bfa]">
                      <Calendar size={22} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                        Dată
                      </p>
                      <p className="text-white font-semibold text-base">
                        {new Date(event.date).toLocaleDateString("ro-RO", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                      <Clock size={22} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                        Oră
                      </p>
                      <p className="text-white font-semibold text-base">
                        {event.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-green-500/20 rounded-xl text-green-400">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                        Locație
                      </p>
                      <p className="text-white font-semibold text-base">
                        {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-orange-500/20 rounded-xl text-orange-400">
                      <User size={22} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                        Participanți
                      </p>
                      <p className="text-white font-semibold text-base">
                        {event.participantsCount} /{" "}
                        {event.maxParticipants > 0
                          ? event.maxParticipants
                          : "Nelimitat"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
                      <Tag size={22} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                        Categorie
                      </p>
                      <p className="text-white font-semibold text-base">
                        {getCategoryLabel(event.category)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10 text-center">
                  <p className="text-xs text-white/40 italic">
                    * Vizualizare administrator (Read-Only)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventReviewPage;
