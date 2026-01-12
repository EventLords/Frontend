import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { EventCalendar, EventCard } from '../components';
import { studentEventsService } from '../services/eventsService';
import { StudentEvent } from '../../../types/student';

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [enrolledEvents, setEnrolledEvents] = useState<StudentEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'enrolled'>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const [allEvents, enrolled] = await Promise.all([
          studentEventsService.getAllEvents(),
          studentEventsService.getEnrolledEvents()
        ]);
        setEvents(allEvents);
        setEnrolledEvents(enrolled);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const displayEvents = viewMode === 'enrolled' ? enrolledEvents : events;

  // Get upcoming events (next 7 days)
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
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
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
                  <span className="text-sm text-white/70">Ziua curentă</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50" />
                  <span className="text-sm text-white/70">Înscris la eveniment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500/50" />
                  <span className="text-sm text-white/70">Eveniment disponibil</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-white/10 border border-white/20" />
                  <span className="text-sm text-white/70">Zi selectată</span>
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
