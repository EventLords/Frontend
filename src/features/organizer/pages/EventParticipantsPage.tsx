import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  CheckCircle, 
  Download, 
  ArrowUpDown,
  Loader,
  User,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { Participant, Event } from '../../../types/organizer';

const EventParticipantsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

  // Refs pentru controlul scroll-ului orizontal
  const registeredScrollRef = useRef<HTMLDivElement>(null);
  const confirmedScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      setIsLoading(true);
      try {
        const [participantsData, eventData] = await Promise.all([
          eventsService.getParticipants(eventId),
          eventsService.getEventById(eventId)
        ]);
        setParticipants(participantsData);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const sortedParticipants = sortAlphabetically
    ? [...participants].sort((a, b) => a.firstName.localeCompare(b.firstName))
    : participants;

  const confirmedParticipants = sortedParticipants.filter(p => p.confirmed);
  const registeredParticipants = sortedParticipants;

  const confirmationRate = participants.length > 0 
    ? Math.round((confirmedParticipants.length / participants.length) * 100) 
    : 0;

  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 75%)`;
  };

  const ParticipantCard: React.FC<{ participant: Participant }> = ({ participant }) => {
    const color = getAvatarColor(participant.firstName + participant.lastName);
    return (
      <div className="flex-none flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl min-w-[160px] hover:bg-white/10 transition-all">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-inner"
          style={{ backgroundColor: color }}
        >
          <User size={14} className="text-gray-800" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white truncate">
            {participant.firstName}
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
            Student
          </span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#1e1e4a]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center text-white/60">
          <Loader size={32} className="animate-spin mx-auto mb-3" />
          <p>Se încarcă participanții...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/organizer/dashboard')}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-[#3A3A7E] transition-all"
      >
        <ArrowLeft size={18} className="text-[#4ECDC4]" />
        <span className="text-sm font-medium">Înapoi la dashboard</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4ECDC4] mb-2">{event?.name}</h1>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar size={14}/> 
              {event?.date ? new Date(event.date).toLocaleDateString('ro-RO') : ''}
            </span>
            <span>•</span>
            <span>{event?.location}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSortAlphabetically(!sortAlphabetically)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              sortAlphabetically ? 'bg-[#4ECDC4] text-[#171738]' : 'bg-white/5 text-white border border-white/10'
            }`}
          >
            <ArrowUpDown size={16} /> A-Z
          </button>
          <button
            onClick={() => event && eventsService.exportParticipantsToCSV(participants, event.name)}
            className="flex items-center gap-2 px-4 py-2 bg-[#4ECDC4] text-[#171738] text-sm font-bold rounded-xl hover:bg-[#3dbdb5] shadow-lg"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Persoane Înscrise */}
      <div className="bg-[#1e1e4a]/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden mb-8 relative group">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={22} className="text-[#4ECDC4]" />
            <h2 className="text-xl font-bold text-white">Persoane Înscrise</h2>
          </div>
          <span className="text-2xl font-bold text-white">{registeredParticipants.length}</span>
        </div>
        <div className="relative p-6">
          <button 
            onClick={() => scroll(registeredScrollRef, 'left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#171738] border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl"
          >
            <ChevronLeft size={20} />
          </button>
          <div 
            ref={registeredScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {registeredParticipants.length === 0 ? (
              <p className="w-full text-center text-white/30 py-4">Fără înscrieri.</p>
            ) : (
              registeredParticipants.map(p => <ParticipantCard key={p.id} participant={p} />)
            )}
          </div>
          <button 
            onClick={() => scroll(registeredScrollRef, 'right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#4ECDC4] text-[#171738] rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Persoane Confirmate */}
      <div className="bg-[#1e1e4a]/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden relative group">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle size={22} className="text-green-400" />
            <h2 className="text-xl font-bold text-white">Persoane Confirmate</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{confirmedParticipants.length}</span>
            <span className="text-xs text-white/40">({confirmationRate}%)</span>
          </div>
        </div>
        <div className="relative p-6">
          <button 
            onClick={() => scroll(confirmedScrollRef, 'left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#171738] border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl"
          >
            <ChevronLeft size={20} />
          </button>
          <div 
            ref={confirmedScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {confirmedParticipants.length === 0 ? (
              <p className="w-full text-center text-white/30 py-4">Fără confirmări.</p>
            ) : (
              confirmedParticipants.map(p => <ParticipantCard key={p.id} participant={p} />)
            )}
          </div>
          <button 
            onClick={() => scroll(confirmedScrollRef, 'right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#4ECDC4] text-[#171738] rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Înscriși', value: registeredParticipants.length, color: 'text-white' },
          { label: 'Confirmați', value: confirmedParticipants.length, color: 'text-green-400' },
          { label: 'În așteptare', value: registeredParticipants.length - confirmedParticipants.length, color: 'text-yellow-400' },
          { label: 'Rată', value: `${confirmationRate}%`, color: 'text-[#4ECDC4]' }
        ].map((s, i) => (
          <div key={i} className="bg-[#2a2a5e]/60 rounded-2xl p-4 border border-white/5 text-center shadow-lg">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] uppercase text-white/40 mt-1 font-bold">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventParticipantsPage;