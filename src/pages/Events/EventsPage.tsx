import React, { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import { EventFiltersBar, PublicEventCard, EventFiltersState, PublicEvent } from '../../components/events';

// Import local event images
import eventImage1 from '../../assets/events/image_ev1.png';
import eventImage2 from '../../assets/events/image_ev2.png';
import eventImage3 from '../../assets/events/image_ev3.png';
import eventImage4 from '../../assets/events/image_ev4.png';
import eventImage5 from '../../assets/events/image_ev5.png';
import eventImage6 from '../../assets/events/image_ev6.png';

// Mock events data (Lăsat neschimbat)
const mockEvents: PublicEvent[] = [
  {
    id: '1',
    title: 'Workshop React Advanced - Hooks & State Management',
    description: 'Învață tehnici avansate de React, inclusiv custom hooks, context API și patterns moderne de state management.',
    date: '2024-12-15',
    time: '10:00',
    location: 'Aula Magna',
    organizer: 'Tech Club USV',
    participants: 45,
    maxParticipants: 60,
    category: 'workshop',
    imageUrl: eventImage1
  },
  {
    id: '2',
    title: 'Hackathon Universitar 2024',
    description: '48 de ore de programare intensivă, networking și premii incredibile. Formează o echipă și câștigă!',
    date: '2024-12-20',
    time: '09:00',
    location: 'Corp A, Etaj 2',
    organizer: 'FIRESC',
    participants: 78,
    maxParticipants: 80,
    category: 'hackathon',
    imageUrl: eventImage2
  },
  {
    id: '3',
    title: 'Conferință: Viitorul Inteligenței Artificiale',
    description: 'Experți din industrie discută despre ultimele dezvoltări în AI și impactul asupra societății.',
    date: '2024-12-22',
    time: '14:00',
    location: 'Amfiteatrul Central',
    organizer: 'Departamentul de Informatică',
    participants: 120,
    maxParticipants: 200,
    category: 'conferinta',
    imageUrl: eventImage3
  },
  {
    id: '4',
    title: 'Seminar: Dezvoltare Personală și Leadership',
    description: 'Descoperă tehnici de leadership și dezvoltare personală care te vor ajuta în carieră.',
    date: '2024-12-28',
    time: '11:00',
    location: 'Corp B, Sala 201',
    organizer: 'Liga Studenților',
    participants: 35,
    maxParticipants: 50,
    category: 'seminar',
    imageUrl: eventImage4
  },
  {
    id: '5',
    title: 'Training: Introducere în Machine Learning',
    description: 'Workshop practic de machine learning pentru începători. Vei construi primul tău model AI!',
    date: '2025-01-05',
    time: '09:00',
    location: 'Laborator Info 1',
    organizer: 'AI Club',
    participants: 28,
    maxParticipants: 30,
    category: 'training',
    imageUrl: eventImage5
  },
  {
    id: '6',
    title: 'Networking Night - IT Edition',
    description: 'Conectează-te cu profesioniști din industria IT și descoperă oportunități de carieră.',
    date: '2025-01-10',
    time: '18:00',
    location: 'Cantina Studențească',
    organizer: 'Career Center',
    participants: 60,
    maxParticipants: 100,
    category: 'networking',
    imageUrl: eventImage6
  },
  {
    id: '7',
    title: 'Workshop: UX/UI Design Fundamentals',
    description: 'Învață principiile de bază ale designului de interfețe și cum să creezi experiențe utilizator memorabile.',
    date: '2025-01-15',
    time: '13:00',
    location: 'Corp A, Sala 105',
    organizer: 'Design Club',
    participants: 22,
    maxParticipants: 40,
    category: 'workshop',
    imageUrl: eventImage1
  },
  {
    id: '8',
    title: 'Conferință: Cybersecurity în Era Digitală',
    description: 'Experți în securitate cibernetică prezintă cele mai recente amenințări și metode de protecție.',
    date: '2025-01-20',
    time: '10:00',
    location: 'Aula Magna',
    organizer: 'Security Lab',
    participants: 95,
    maxParticipants: 150,
    category: 'conferinta',
    imageUrl: eventImage4
  },
  {
    id: '9',
    title: 'Seminar: Scrierea CV-ului Perfect',
    description: 'Cum să îți creezi un CV care să atragă atenția angajatorilor și să îți crească șansele de angajare.',
    date: '2025-01-25',
    time: '14:00',
    location: 'Online',
    organizer: 'Career Center',
    participants: 45,
    maxParticipants: 100,
    category: 'seminar',
    imageUrl: eventImage5
  }
];

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<EventFiltersState>({
    search: '',
    category: 'all',
    type: 'all',
    location: '',
    period: 'all'
  });

  // Simulate loading events
  useEffect(() => {
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 500);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...events];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.organizer.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(event => event.category === filters.category);
    }

    // Location filter
    if (filters.location) {
      result = result.filter(event => 
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Period filter
    if (filters.period !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      result = result.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        switch (filters.period) {
          case 'today':
            return eventDate.getTime() === today.getTime();
          case 'week':
            return eventDate >= today && eventDate <= endOfWeek;
          case 'month':
            return eventDate >= today && eventDate <= endOfMonth;
          case 'upcoming':
            return eventDate >= today;
          default:
            return true;
        }
      });
    }

    setFilteredEvents(result);
  }, [filters, events]);

  return (
    <div 
      className="min-h-screen pt-16"
      style={{
        // =========================================================================
        // NOU: GRADIENT DARK CU NUANȚĂ DE VERDE/TEAL
        // =========================================================================
        backgroundColor: '#0a1616', 
        backgroundImage: `radial-gradient(
            at top center, 
            #1a3a38 0%,        
            #0a1616 50%,       
            #000000 100%       
        )`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Descoperă Evenimente
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Găsește evenimentele universitare care te interesează și înscrie-te pentru a participa
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <EventFiltersBar
            filters={filters}
            onFilterChange={setFilters}
            resultsCount={filteredEvents.length}
          />
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-3 border-white/20 border-t-[#4ECDC4] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Se încarcă evenimentele...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nu s-au găsit evenimente
            </h3>
            <p className="text-white/60 mb-4">
              Încearcă să modifici filtrele pentru a găsi evenimente
            </p>
            <button
              onClick={() => setFilters({
                search: '',
                category: 'all',
                type: 'all',
                location: '',
                period: 'all'
              })}
              className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3dbdb5] transition-colors"
            >
              Resetează filtrele
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <PublicEventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-2xl p-6 text-center">
          <Calendar size={32} className="mx-auto text-[#4ECDC4] mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Vrei să participi la evenimente?
          </h3>
          <p className="text-white/70 mb-4">
            Creează-ți un cont gratuit pentru a te înscrie la evenimente și a primi notificări
          </p>
          <a
            href="/inregistrare"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4ECDC4] text-white font-medium rounded-xl hover:bg-[#3dbdb5] transition-colors"
          >
            Creează cont gratuit
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;