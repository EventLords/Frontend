import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';
import { StudentEvent, EventCategory } from '../../../types/student';

interface EventCardProps {
  event: StudentEvent;
  variant?: 'default' | 'compact';
}

const categoryColors: Record<EventCategory, { bg: string; text: string; border: string }> = {
  workshop: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  conferinta: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  hackathon: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  seminar: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  targ: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  competitie: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  training: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  networking: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  altele: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
};

const categoryLabels: Record<EventCategory, string> = {
  workshop: 'Workshop',
  conferinta: 'Conferință',
  hackathon: 'Hackathon',
  seminar: 'Seminar',
  targ: 'Târg',
  competitie: 'Competiție',
  training: 'Training',
  networking: 'Networking',
  altele: 'Altele',
};

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'default' }) => {
  const colors = categoryColors[event.category];
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 5;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (variant === 'compact') {
    return (
      <Link
        to={`/student/events/${event.id}`}
        className="block bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 transition-all group"
      >
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate group-hover:text-[#4ECDC4] transition-colors">
              {event.name}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {event.time}
              </span>
            </div>
          </div>

          {/* Status */}
          {event.isEnrolled && (
            <div className="shrink-0">
              <CheckCircle size={20} className="text-green-400" />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/student/events/${event.id}`}
      className="block bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
          {categoryLabels[event.category]}
        </span>

        {/* Enrolled Badge */}
        {event.isEnrolled && (
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
            <CheckCircle size={12} />
            Înscris
          </span>
        )}

        {/* Spots Warning */}
        {!event.isEnrolled && (isFull || isAlmostFull) && (
          <span className={`absolute bottom-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
            isFull 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            {isFull ? 'Complet' : `${spotsLeft} locuri rămase`}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-white group-hover:text-[#4ECDC4] transition-colors line-clamp-2 mb-2">
          {event.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/60 line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar size={14} className="text-[#4ECDC4]" />
            <span>{formatDate(event.date)} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={14} className="text-[#4ECDC4]" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Users size={14} className="text-[#4ECDC4]" />
            <span>{event.currentParticipants} / {event.maxParticipants} participanți</span>
          </div>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs text-white/60 bg-white/5 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#4ECDC4] group-hover:text-[#3dbdb5] transition-colors">
            Vezi detalii
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
