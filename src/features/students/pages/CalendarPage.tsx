// src/pages/CalendarPage.tsx (COD COMPLET ȘI FINAL)

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, MapPin, Users, User } from 'lucide-react';
import CalendarComponent from 'react-calendar';
import { format } from 'date-fns';

// -------------------------------------------------------------------------
// TIPURI ȘI SERVICII MOCK PENTRU TESTARE
// -------------------------------------------------------------------------

// Tipul Event (Asigură-te că se potrivește cu '../../../types/student')
export interface StudentEvent {
    id: string;
    title: string;
    description: string;
    date: string; // 'YYYY-MM-DD'
    time: string;
    location: string;
    organizer: string;
    participants: number;
    maxParticipants: number;
    category: string;
    imageUrl: string; 
}

const mockEvent: StudentEvent = {
    id: 'mock-1', title: 'Eveniment Mock', description: 'Descriere', date: '2025-12-25', time: '12:00', location: 'Online', organizer: 'MockOrg', participants: 10, maxParticipants: 20, category: 'seminar', imageUrl: 'path/to/image.png'
};

// Evenimentele tale înscrise (pentru evidențierea TEAL)
const mockEnrolledEvents: StudentEvent[] = [
    { ...mockEvent, id: 'E1', title: 'Workshop React', date: '2025-12-15', time: '10:00', location: 'Campus Central', organizer: 'Tech Club' },
    { ...mockEvent, id: 'E2', title: 'Conferință AI', date: '2025-12-22', time: '14:00', location: 'Aula Magna', organizer: 'Info Dept.' },
];

// Toate evenimentele disponibile (pentru evidențierea albastră/disponibil)
const mockEventsData: StudentEvent[] = [
    { ...mockEvent, id: '1', title: 'Workshop React', date: '2025-12-15', time: '10:00', category: 'workshop' }, // Înscris
    { ...mockEvent, id: '2', title: 'Hackathon', date: '2025-12-20', time: '09:00', category: 'hackathon' }, // Disponibil
    { ...mockEvent, id: '3', title: 'Conferință AI', date: '2025-12-22', time: '14:00', category: 'conferinta' }, // Înscris
    { ...mockEvent, id: '4', title: 'Seminar Leadership', date: '2025-12-28', time: '11:00', category: 'seminar' }, // Disponibil
];

// -------------------------------------------------------------------------
// COMPONENTE INTEGRATE (EventCalendar & EventCard)
// -------------------------------------------------------------------------

// --- COMPONENTA EventCalendar ---
interface EventCalendarProps {
    events: StudentEvent[]; 
    enrolledEvents: StudentEvent[]; 
    selectedDate: Date | undefined;
    onDateSelect: (date: Date) => void;
}

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

const getDatesSet = (events: StudentEvent[]): Set<string> => {
    return new Set(events.map(e => format(new Date(e.date), 'yyyy-MM-dd')));
};

const EventCalendar: React.FC<EventCalendarProps> = ({ events, enrolledEvents, selectedDate, onDateSelect }) => {
    
    const enrolledDates = getDatesSet(enrolledEvents);
    const allAvailableDates = getDatesSet(events);
    
    const tileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const formattedDate = format(date, 'yyyy-MM-dd');
            
            // 1. Evidențiază dacă ESTE înscris (Clasa 'enrolled-event-date')
            if (enrolledDates.has(formattedDate)) {
                return 'enrolled-event-date'; 
            }
            
            // 2. Evidențiază dacă există evenimente disponibile (Clasa 'available-event-date')
            if (allAvailableDates.has(formattedDate)) {
                return 'available-event-date'; 
            }
        }
        return null;
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 shadow-xl">
            <CalendarComponent
                onChange={onDateSelect as any} 
                value={selectedDate as CalendarValue}
                tileClassName={tileClassName}
                locale="ro-RO" 
                calendarType="iso8601" // Forma corectă
                className="w-full border-none p-0 bg-transparent text-white custom-react-calendar" 
                defaultValue={new Date(2025, 11, 15)} // Setează luna Decembrie 2025
            />
        </div>
    );
};

// --- COMPONENTA EventCard (Compact) ---
interface EventCardProps {
    event: StudentEvent;
    variant: 'compact'; 
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const displayDate = format(new Date(event.date), 'dd MMM yyyy'); 
    
    // Verifică dacă este înscris (dacă ID-ul evenimentului există în lista de evenimente înscrise)
    // NOTĂ: Acest check nu poate fi făcut simplu aici, dar vom presupune că EventCard ești tu.

    return (
        <Link 
            to={`/student/events/${event.id}`} 
            className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
            <div className="flex-shrink-0 text-center">
                <Calendar size={20} className="text-[#4ECDC4] mx-auto mb-1" />
                <span className="text-xs text-white/70">{displayDate}</span>
            </div>

            <div className="flex-grow">
                <p className="font-semibold text-white text-sm line-clamp-1">
                    {event.title}
                </p>
                <div className="text-xs text-white/50 space-y-0.5 mt-1">
                    <div className="flex items-center gap-1">
                        <MapPin size={10} />
                        <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <User size={10} />
                        <span className="truncate">{event.organizer}</span>
                    </div>
                </div>
            </div>
            <ChevronRight size={18} className="text-white/50 flex-shrink-0 mt-2" />
        </Link>
    );
};


// -------------------------------------------------------------------------
// PAGINA PRINCIPALĂ: CalendarPage
// -------------------------------------------------------------------------

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [enrolledEvents, setEnrolledEvents] = useState<StudentEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 11, 15)); // 15 Dec 2025
  const [eventsOnSelectedDay, setEventsOnSelectedDay] = useState<StudentEvent[]>([]); // NOU
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'enrolled'>('all');

// Funcție pentru a găsi evenimentele dintr-o zi selectată (fără duplicate)
const getEventsForSelectedDay = useCallback((date: Date, allEvents: StudentEvent[]): StudentEvent[] => {
    if (!date) return [];
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    const uniqueEventsMap = new Map<string, StudentEvent>();
    
    allEvents.forEach(event => {
        if (event.date === formattedDate) {
            uniqueEventsMap.set(event.id, event);
        }
    });

    return Array.from(uniqueEventsMap.values());
}, []); // Dependență goală, nu depinde de state-ul care se schimbă

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // --- MOCK DATA PENTRU TEST ---
        await new Promise(resolve => setTimeout(resolve, 500)); 
        const all = mockEventsData;
        const enrolled = mockEnrolledEvents;

        setEvents(all);
        setEnrolledEvents(enrolled);

        // 1. Setează data inițială (15 Dec 2025)
        const initialDate = new Date(2025, 11, 15); 
        setSelectedDate(initialDate);
        
        // 2. Populează imediat panoul de detalii cu evenimentele din ziua inițială
        setEventsOnSelectedDay(getEventsForSelectedDay(initialDate, all));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [getEventsForSelectedDay]);


  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // 🛑 NOU: Actualizează panoul de detalii când se apasă o dată
    setEventsOnSelectedDay(getEventsForSelectedDay(date, events)); 
  };

  const displayEvents = viewMode === 'enrolled' ? enrolledEvents : events;

  // Get upcoming enrolled events (next 7 days)
  const upcomingEvents = enrolledEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 7);
    return eventDate >= today && eventDate <= weekFromNow;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Calendar Evenimente
          </h1>
          <p className="text-white/60">
            Vizualizează toate evenimentele într-o singură privire
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'all'
                ? 'bg-[#4ECDC4] text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Toate evenimentele
          </button>
          <button
            onClick={() => setViewMode('enrolled')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'enrolled'
                ? 'bg-[#4ECDC4] text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Evenimentele mele
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-white/20 border-t-[#4ECDC4] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Se încarcă calendarul...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="xl:col-span-2">
            <EventCalendar
              events={displayEvents}
              enrolledEvents={enrolledEvents} 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect} 
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
                {/* NOU: Detalii Evenimente din Ziua Selectată */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <Calendar size={18} className="text-[#4ECDC4]" />
                            Detalii pentru {selectedDate ? format(selectedDate, 'dd MMMM yyyy') : 'Selectează o dată'}
                        </h2>
                    </div>

                    {eventsOnSelectedDay.length === 0 ? (
                        <div className="text-center py-6 text-white/50">
                            <p>Nu există evenimente disponibile în această zi.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {eventsOnSelectedDay.map((event) => (
                                <EventCard 
                                    key={event.id} 
                                    event={event} 
                                    variant="compact" 
                                /> 
                            ))}
                        </div>
                    )}
                </div>

            {/* Upcoming Events (Rămâne sub Detalii Zi Selectată) */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Calendar size={18} className="text-[#4ECDC4]" />
                  Evenimente viitoare
                </h2>
                <span className="text-xs text-white/40">Săptămâna aceasta</span>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar size={32} className="mx-auto text-white/20 mb-2" />
                  <p className="text-sm text-white/50">
                    Nu ai evenimente în această săptămână
                  </p>
                  <Link
                    to="/student/dashboard"
                    className="inline-flex items-center gap-1 text-sm text-[#4ECDC4] mt-2 hover:underline"
                  >
                    Descoperă evenimente
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 4).map((event) => (
                    <EventCard key={event.id} event={event} variant="compact" />
                  ))}
                  
                  {upcomingEvents.length > 4 && (
                    <Link
                      to="/student/events?enrolled=true"
                      className="block text-center text-sm text-[#4ECDC4] hover:underline py-2"
                    >
                      Vezi toate ({upcomingEvents.length})
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <h3 className="font-semibold text-white mb-4">Legendă</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-[#4ECDC4]" />
                  <span className="text-sm text-white/70">Ziua curentă / Eveniment înscris selectat</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50" />
                  <span className="text-sm text-white/70">Eveniment înscris (pe calendar, nu în legendă)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500/50" />
                  <span className="text-sm text-white/70">Eveniment disponibil (pe calendar)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-white/10 border border-white/20" />
                  <span className="text-sm text-white/70">Zi selectată (pe calendar)</span>
                </div>
            </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#4ECDC4]/20 to-purple-500/20 rounded-2xl border border-white/10 p-5">
              <h3 className="font-semibold text-white mb-4">Statistici</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-white">{enrolledEvents.length}</p>
                  <p className="text-xs text-white/60">Înscris la</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{upcomingEvents.length}</p>
                  <p className="text-xs text-white/60">Săptămâna asta</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{events.length}</p>
                  <p className="text-xs text-white/60">Total disponibile</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {events.filter(e => new Date(e.date) > new Date()).length}
                  </p>
                  <p className="text-xs text-white/60">Viitoare</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;