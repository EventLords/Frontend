import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  CheckCircle, 
  Download, 
  ArrowUpDown,
  Loader,
  User
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

  const sortedParticipants = sortAlphabetically
    ? [...participants].sort((a, b) => a.firstName.localeCompare(b.firstName))
    : participants;

  const confirmedParticipants = sortedParticipants.filter(p => p.confirmed);
  const registeredParticipants = sortedParticipants;

  const confirmationRate = participants.length > 0 
    ? Math.round((confirmedParticipants.length / participants.length) * 100) 
    : 0;

  const handleExportCSV = () => {
    if (event) {
      eventsService.exportParticipantsToCSV(participants, event.name);
    }
  };

  // Generate pastel color based on name
  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 75%)`;
  };

  const ParticipantBadge: React.FC<{ participant: Participant }> = ({ participant }) => {
    const bgColor = getAvatarColor(participant.firstName + participant.lastName);
    return (
      <div 
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
        style={{ backgroundColor: bgColor }}
      >
        <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
          <User size={12} className="text-gray-700" />
        </div>
        <span className="font-medium text-gray-800">{participant.firstName}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#1e1e4a]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          <Loader size={32} className="text-white/60 animate-spin mx-auto mb-3" />
          <p className="text-white/60">Se încarcă participanții...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#1e1e4a]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          <p className="text-white/60">Evenimentul nu a fost găsit.</p>
          <button
            onClick={() => navigate('/organizer/dashboard')}
            className="mt-4 text-[#4ECDC4] hover:underline"
          >
            Înapoi la dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Back Button - Stil Nou */}
       <button
         onClick={() => navigate('/organizer/dashboard')}
         className="flex items-center gap-2 mb-6 transition-all 
                   px-4 py-2 rounded-full border border-white/10 
                   bg-white/5 text-white 
                     hover:bg-[#3A3A7E] hover:border-[#4ECDC4]/50"
       >
         <ArrowLeft size={18} className="text-[#4ECDC4]" />
        <span className="text-sm font-medium">Înapoi la dashboard</span>
       </button>

      {/* Event Info Header */}
      <div className="bg-[#1e1e4a]/60 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
        <h1 className="text-lg font-bold text-white">{event.name}</h1>
        <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
          <span>{new Date(event.date).toLocaleDateString('ro-RO')}</span>
          <span>•</span>
          <span>{event.location}</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortAlphabetically(!sortAlphabetically)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              sortAlphabetically 
                ? 'bg-[#4ECDC4]/20 text-[#4ECDC4] border border-[#4ECDC4]/30'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            }`}
          >
            <ArrowUpDown size={16} />
            Ordonare alfabetică
          </button>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#4ECDC4] text-white text-sm font-medium rounded-lg hover:bg-[#3dbdb5] transition-colors"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Registered Section */}
      <div className="bg-[#1e1e4a]/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-[#4ECDC4]" />
            <h2 className="text-lg font-semibold text-white">Persoane Înscrise</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">{registeredParticipants.length}</span>
            <button className="p-2 text-white/60 hover:text-white transition-colors">
              <Download size={18} />
            </button>
          </div>
        </div>
        <div className="p-5">
          {registeredParticipants.length === 0 ? (
            <p className="text-center text-white/40 py-8">Nu există persoane înscrise încă.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {registeredParticipants.map(participant => (
                <ParticipantBadge key={participant.id} participant={participant} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmed Section */}
      <div className="bg-[#1e1e4a]/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400" />
            <h2 className="text-lg font-semibold text-white">Persoane Confirmate</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">{confirmedParticipants.length}</span>
            <span className="text-sm text-white/60">
              ({confirmationRate}% din înscrieri)
            </span>
            <button className="p-2 text-white/60 hover:text-white transition-colors">
              <Download size={18} />
            </button>
          </div>
        </div>
        <div className="p-5">
          {confirmedParticipants.length === 0 ? (
            <p className="text-center text-white/40 py-8">Nu există persoane confirmate încă.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {confirmedParticipants.map(participant => (
                <ParticipantBadge key={participant.id} participant={participant} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2a2a5e]/60 rounded-xl p-4 border border-white/10 text-center">
          <p className="text-2xl font-bold text-white">{registeredParticipants.length}</p>
          <p className="text-xs text-white/60 mt-1">Total înscriși</p>
        </div>
        <div className="bg-[#2a2a5e]/60 rounded-xl p-4 border border-white/10 text-center">
          <p className="text-2xl font-bold text-green-400">{confirmedParticipants.length}</p>
          <p className="text-xs text-white/60 mt-1">Confirmați</p>
        </div>
        <div className="bg-[#2a2a5e]/60 rounded-xl p-4 border border-white/10 text-center">
          <p className="text-2xl font-bold text-yellow-400">{registeredParticipants.length - confirmedParticipants.length}</p>
          <p className="text-xs text-white/60 mt-1">În așteptare</p>
        </div>
        <div className="bg-[#2a2a5e]/60 rounded-xl p-4 border border-white/10 text-center">
          <p className="text-2xl font-bold text-white">{confirmationRate}%</p>
          <p className="text-xs text-white/60 mt-1">Rată confirmare</p>
        </div>
      </div>
    </div>
  );
};

export default EventParticipantsPage;
