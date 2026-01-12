import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, User } from 'lucide-react';

export interface PublicEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  participants: number;
  maxParticipants: number;
  category: string;
  imageUrl?: string;
}

interface PublicEventCardProps {
  event: PublicEvent;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  workshop: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  conferinta: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  hackathon: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
  seminar: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
  training: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  networking: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
};

const categoryLabels: Record<string, string> = {
  workshop: 'Workshop',
  conferinta: 'Conferință',
  hackathon: 'Hackathon',
  seminar: 'Seminar',
  training: 'Training',
  networking: 'Networking',
};

const PublicEventCard: React.FC<PublicEventCardProps> = ({ event }) => {
  const colors = categoryColors[event.category] || { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500/30' };
  const hasLimit = typeof event.maxParticipants === "number" && event.maxParticipants > 0;
  const spotsLeft = hasLimit ? event.maxParticipants - event.participants : Infinity;
  const isFull = hasLimit ? spotsLeft <= 0 : false;
  const isAlmostFull = hasLimit ? spotsLeft > 0 && spotsLeft <= 5 : false;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "Nespecificat";
    return new Date(dateStr).toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Bucharest",
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:border-white/30 hover:bg-white/15 transition-all group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#3F3176] to-[#1a1a4e] flex items-center justify-center">
            <Calendar size={40} className="text-white/30" />
          </div>
        )}
        
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
          {categoryLabels[event.category] || event.category}
        </span>

        {/* Spots Warning */}
        {(isFull || isAlmostFull) && (
          <span className={`absolute bottom-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
            isFull 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
          }`}>
            {isFull ? 'Complet' : `${spotsLeft} locuri rămase`}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-1 mb-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/60 line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar size={14} className="text-[#a78bfa]" />
            <span>{formatDate(event.date)}</span>
            <Clock size={14} className="text-[#a78bfa] ml-2" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={14} className="text-[#a78bfa]" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Users size={14} className="text-[#a78bfa]" />
            <span>{event.participants} / {hasLimit ? event.maxParticipants : "Nelimitat"} participanți</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <User size={14} className="text-[#a78bfa]" />
            <span>Organizat de: <span className="text-white font-medium">{event.organizer}</span></span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-center">
          <Link
            to={`/login?redirect=/student/events/${event.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#a78bfa]/40 text-[#c4b5fd] font-medium rounded-xl hover:bg-[#a78bfa]/15 hover:border-[#a78bfa]/60 transition-colors text-sm"
          >
            Vezi detalii
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicEventCard;
