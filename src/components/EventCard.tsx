import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Event } from '../types';
import Button from './Button';

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
  const categoryColors: Record<string, string> = {
    conference: 'bg-blue-100 text-blue-800',
    workshop: 'bg-green-100 text-green-800',
    seminar: 'bg-purple-100 text-purple-800',
    cultural: 'bg-pink-100 text-pink-800',
    sports: 'bg-orange-100 text-orange-800',
    social: 'bg-yellow-100 text-yellow-800',
    academic: 'bg-indigo-100 text-indigo-800',
    other: 'bg-gray-100 text-gray-800',
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
      <div className="bg-white rounded-xl shadow-card p-4 hover:shadow-card-hover transition-all">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-unify-mint flex items-center justify-center flex-shrink-0">
            <Calendar className="text-unify-purple" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-unify-navy truncate">{event.title}</h4>
            <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
            <p className="text-sm text-gray-500">{event.location}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-unify-mint to-unify-purple-light">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="text-white/50" size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
            {categoryLabels[event.category]}
          </span>
        </div>
        {isFull && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Complet
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-unify-navy mb-2 line-clamp-2 group-hover:text-unify-purple transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} className="text-unify-purple" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} className="text-unify-purple" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} className="text-unify-purple" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={16} className="text-unify-purple" />
            <span>
              {event.currentParticipants}/{event.maxParticipants} participanți
              {!isFull && <span className="text-green-600 ml-1">({spotsLeft} locuri libere)</span>}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-gray-500">
            Organizat de {event.organizer.organizationName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(event.id)}
            className="group/btn"
          >
            Detalii
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
