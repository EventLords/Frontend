import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
// import { Event } from '../types'; // Asigură-te că Event este importat corect
// import Button from './Button'; // Asigură-te că Button este importat corect

// Definiri Tipuri Mock pentru autonomie (înlocuiește cu importurile tale reale)
interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    currentParticipants: number;
    maxParticipants: number;
    category: string;
    imageUrl?: string;
    organizer: {
        organizationName: string;
    };
}
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'ghost' | 'primary';
    size: 'sm' | 'md';
    // ... alte props
}
const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
    <button className={`flex items-center gap-1 font-semibold transition-colors ${className}`} {...props}>
        {children}
    </button>
);


interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'featured';
  onViewDetails?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  variant = 'default',
  onViewDetails,
}) => {
    // 🎨 CULORILE TEMEI DARK
    const highlightColor = '#4ECDC4'; // Teal
    const accentColor = '#A0A4E1'; // Violet deschis (pentru iconițe)
    const darkContainerBg = 'bg-white/5'; 
    const darkContainerBorder = 'border-white/10';
    const darkHoverBorder = `hover:border-[${highlightColor}]`;


  const categoryColors: Record<string, string> = {
    conference: 'bg-blue-500/20 text-blue-400',
    workshop: 'bg-green-500/20 text-green-400',
    seminar: 'bg-purple-500/20 text-purple-400',
    cultural: 'bg-pink-500/20 text-pink-400',
    sports: 'bg-orange-500/20 text-orange-400',
    social: 'bg-yellow-500/20 text-yellow-400',
    academic: 'bg-indigo-500/20 text-indigo-400',
    other: 'bg-gray-500/20 text-gray-400',
  };

  const categoryLabels: Record<string, string> = {
    conference: 'Conferință',
    workshop: 'Workshop',
    seminar: 'Seminar',
    cultural: 'Cultural',
    sports: 'Sport',
    social: 'Social',
    academic: 'Academic',
    other: 'Altele',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isFull = spotsLeft <= 0;

  if (variant === 'compact') {
    return (
      // 🛑 COMPACT VARIANT ADJUSTAT
      <div className={`rounded-xl shadow-lg p-4 transition-all border ${darkContainerBg} ${darkContainerBorder} hover:border-[${highlightColor}]`}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: highlightColor }}>
            <Calendar className="text-[#3F3176]" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{event.title}</h4>
            <p className="text-sm text-white/60">{formatDate(event.date)}</p>
            <p className="text-sm text-white/60">{event.location}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    // 🛑 DEFAULT VARIANT ADJUSTAT
    <div className={`${darkContainerBg} rounded-2xl shadow-xl overflow-hidden transition-all group flex flex-col border ${darkContainerBorder} ${darkHoverBorder} h-full`}>
      {/* Image */}
      <div className="relative h-48 bg-white/10 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="text-white/30" size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
            {categoryLabels[event.category]}
          </span>
        </div>
        {isFull && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/80 text-white">
              Complet
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-xl text-white mb-2 line-clamp-2 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-white/70 text-sm mb-4 line-clamp-2 flex-grow">
          {event.description}
        </p>

        {/* Detalii cu Iconițe */}
        <div className="space-y-2 mb-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar size={16} style={{ color: accentColor }} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Clock size={16} style={{ color: accentColor }} />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={16} style={{ color: accentColor }} />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Users size={16} style={{ color: accentColor }} />
            <span>
              {event.currentParticipants}/{event.maxParticipants} participanți
              {!isFull && <span className="text-green-400 ml-1">({spotsLeft} locuri libere)</span>}
            </span>
          </div>
        </div>

        {/* Acțiuni */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm text-white/60">
            Organizat de {event.organizer.organizationName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(event.id)}
            className="text-white hover:text-[#4ECDC4] group/btn" // Ajustat pentru dark mode
          >
            Detalii
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" style={{ color: highlightColor }} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;