import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import { StudentEvent } from "../types/student";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: StudentEvent;
  variant?: "default" | "compact";
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  variant = "default",
}) => {
  const navigate = useNavigate();

  // Configurație culori pentru categorii
  const categoryStyles: Record<string, string> = {
    workshop: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    conferință: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    hackathon: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    seminar: "bg-green-500/20 text-green-400 border-green-500/30",
    târg: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    competiție: "bg-red-500/20 text-red-400 border-red-500/30",
    training: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    networking: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  // Normalizăm cheia pentru a găsi culoarea, dar păstrăm textul original din event.category
  const categoryKey = event.category?.toLowerCase() || "";
  const currentStyle =
    categoryStyles[categoryKey] ||
    "bg-gray-500/20 text-gray-400 border-gray-500/30";

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nespecificat";
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "Nespecificat";
    return new Date(dateString).toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Bucharest",
    });
  };

  const hasLimit = typeof event.maxParticipants === "number" && event.maxParticipants > 0;
  const spotsLeft = hasLimit
    ? event.maxParticipants - (event.currentParticipants || 0)
    : Infinity;
  const isFull = hasLimit ? spotsLeft <= 0 : false;

  if (variant === "compact") {
    return (
      <div
        onClick={() => navigate(`/student/events/${event.id}`)}
        className="bg-[#1a1a3a] border border-white/10 rounded-xl p-4 hover:bg-[#232355] transition-all cursor-pointer shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="text-purple-400" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate text-sm">
              {event.name}
            </h4>
            <p className="text-[10px] text-white/50">
              {formatDate(event.date)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#151632] rounded-2xl border border-white/5 overflow-hidden hover:border-purple-500/50 transition-all group flex flex-col h-full shadow-2xl">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/assets/events/default.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1E1E40]">
            <ImageIcon className="text-white/10" size={48} />
          </div>
        )}

        {/* Badge Categorie - Afișează textul din DB, nu fallback-ul */}
        {event.category && (
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${currentStyle}`}
            >
              {event.category}
            </span>
          </div>
        )}

        {isFull && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/80 text-white uppercase backdrop-blur-md border border-red-500/50 shadow-lg">
              Complet
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {event.name}
        </h3>

        <p className="text-white/50 text-xs mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2 mb-6 flex-1">
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <Calendar size={14} className="text-purple-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <Clock size={14} className="text-purple-400" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <MapPin size={14} className="text-purple-400" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <Users size={14} className="text-purple-400" />
            <span>
              {event.currentParticipants}/{hasLimit ? event.maxParticipants : "Nelimitat"} participanți
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="min-w-0 flex-1">
            <span className="block text-[9px] text-white/30 uppercase font-bold tracking-widest">
              Organizator
            </span>
            <span className="block text-xs text-white/80 font-medium truncate">
              {event.organizer.name}
            </span>
          </div>
          <button
            onClick={() => navigate(`/student/events/${event.id}`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg text-[11px] font-bold transition-all"
          >
            Detalii
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
