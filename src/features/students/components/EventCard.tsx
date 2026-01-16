import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  User,
  ArrowRight,
  Heart,
  Share2,
  Trash2,
} from "lucide-react";
import { StudentEvent } from "../../../types/student";
import { useNavigate } from "react-router-dom";
import { studentEventsService } from "../services/eventsService";

interface EventCardProps {
  event: StudentEvent;
  variant?: "default" | "compact";
  onRemoveFavorite?: (eventId: string) => void;
  isFavoritePage?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  workshop: { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/30" },
  conferință: { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/30" },
  hackathon: { bg: "bg-orange-500/20", text: "text-orange-300", border: "border-orange-500/30" },
  seminar: { bg: "bg-green-500/20", text: "text-green-300", border: "border-green-500/30" },
  târg: { bg: "bg-pink-500/20", text: "text-pink-300", border: "border-pink-500/30" },
  competiție: { bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/30" },
  training: { bg: "bg-cyan-500/20", text: "text-cyan-300", border: "border-cyan-500/30" },
  networking: { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/30" },
};

const EventCard: React.FC<EventCardProps> = ({
  event,
  onRemoveFavorite,
  isFavoritePage = false,
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(event.isFavorite || false);
  const [isToggling, setIsToggling] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/student/events/${event.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `Vezi evenimentul: ${event.name}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copiat în clipboard!");
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;
    setIsToggling(true);
    try {
      const result = await studentEventsService.toggleFavorite(event.id);
      setIsFavorite(result.favorited);
    } catch (error) {
      console.error("Favorite toggle error:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemoveFavorite) onRemoveFavorite(event.id);
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    if (!dateString) return "Nespecificat";
    
    // Parse date - handle both ISO format and YYYY-MM-DD
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Nespecificat";
    
    // Format date as DD.MM.YYYY
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    
    // Handle time - use timeString if provided, otherwise extract from date
    let formattedTime = "";
    if (timeString) {
      // Time is already in HH:mm format
      formattedTime = timeString.substring(0, 5);
    } else {
      // Extract time from ISO date string
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      formattedTime = `${hours}:${minutes}`;
    }
    
    return `${formattedDate} • ${formattedTime}`;
  };

  const categoryKey = event.category?.toLowerCase() || "";
  const colors = categoryColors[categoryKey] || { bg: "bg-gray-500/20", text: "text-gray-300", border: "border-gray-500/30" };

  const hasLimit = typeof event.maxParticipants === "number" && event.maxParticipants > 0;
  const spotsLeft = hasLimit ? event.maxParticipants - (event.currentParticipants || 0) : Infinity;
  const isFull = hasLimit ? spotsLeft <= 0 : false;
  const isAlmostFull = hasLimit ? spotsLeft > 0 && spotsLeft <= 5 : false;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:border-white/30 hover:bg-white/15 transition-all group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/assets/events/default.png";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#3F3176] to-[#1a1a4e] flex items-center justify-center">
            <Calendar size={40} className="text-white/30" />
          </div>
        )}

        {/* Category Badge */}
        {event.category && (
          <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
            {event.category}
          </span>
        )}

        {/* Spots Warning */}
        {(isFull || isAlmostFull) && (
          <span className={`absolute bottom-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
            isFull 
              ? "bg-red-500/20 text-red-300 border border-red-500/30" 
              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
          }`}>
            {isFull ? "Complet" : `${spotsLeft} locuri`}
          </span>
        )}

        {/* Action Buttons - Stacked vertically on the right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {isFavoritePage ? (
            <button
              onClick={handleTrashClick}
              className="p-2 rounded-full bg-[#1a1040]/80 backdrop-blur-md border border-white/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              title="Șterge din favorite"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                isFavorite
                  ? "bg-[#a78bfa] text-white border-[#a78bfa]"
                  : "bg-[#1a1040]/80 text-white border-white/20 hover:bg-[#a78bfa]/50"
              }`}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-[#1a1040]/80 backdrop-blur-md border border-white/20 text-white hover:bg-[#a78bfa]/50 transition-all opacity-0 group-hover:opacity-100"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-1 mb-2">
          {event.name}
        </h3>

        <p className="text-sm text-white/60 line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar size={14} className="text-[#a78bfa]" />
            <span>{formatDateTime(event.date, event.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={14} className="text-[#a78bfa]" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Users size={14} className="text-[#a78bfa]" />
            <span>
              {event.currentParticipants} / {hasLimit ? event.maxParticipants : "Nelimitat"} participanți
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <User size={14} className="text-[#a78bfa]" />
            <span>Organizat de: <span className="text-white font-medium">{event.organizer?.name || "Organizator"}</span></span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={() => navigate(`/student/events/${event.id}`)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#a78bfa]/40 text-[#c4b5fd] font-medium rounded-xl hover:bg-[#a78bfa]/15 hover:border-[#a78bfa]/60 transition-colors text-sm"
          >
            Vezi detalii <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
