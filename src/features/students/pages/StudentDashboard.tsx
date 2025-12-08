import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Clock, Award } from 'lucide-react';
import { EventFilters, EventCard } from '../components';
import { studentEventsService } from '../services/eventsService';
import { StudentEvent, EventFilters as FilterType } from '../../../types/student';

const StudentDashboard: React.FC = () => {
  const [, setEvents] = useState<StudentEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<StudentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    category: 'all',
    period: 'all',
    location: '',
    faculty: ''
  });

  // Mock stats
  const stats = {
    enrolledEvents: 3,
    upcomingEvents: 5,
    completedEvents: 12,
    totalHours: 48
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await studentEventsService.getAllEvents();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      const filtered = await studentEventsService.getAllEvents(filters);
      setFilteredEvents(filtered);
    };
    applyFilters();
  }, [filters]);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    suffix?: string;
    color: string;
  }> = ({ icon, label, value, suffix, color }) => (
    <div className={`${color} rounded-xl p-4 border border-white/10`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
        <div>
          <p className="text-2xl font-bold text-white">
            {value}{suffix}
          </p>
          <p className="text-sm text-white/60">{label}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Descoperă evenimente
        </h1>
        <p className="text-white/60">
          Găsește și înscrie-te la evenimentele universitare care te interesează
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Calendar size={20} className="text-blue-400" />}
          label="Înscris la"
          value={stats.enrolledEvents}
          suffix=" evenimente"
          color="bg-blue-500/10"
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-green-400" />}
          label="Viitoare"
          value={stats.upcomingEvents}
          suffix=" evenimente"
          color="bg-green-500/10"
        />
        <StatCard
          icon={<Award size={20} className="text-purple-400" />}
          label="Completate"
          value={stats.completedEvents}
          suffix=" evenimente"
          color="bg-purple-500/10"
        />
        <StatCard
          icon={<Clock size={20} className="text-orange-400" />}
          label="Total ore"
          value={stats.totalHours}
          suffix="h"
          color="bg-orange-500/10"
        />
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          to="/student/calendar"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors"
        >
          <Calendar size={16} />
          Vezi calendarul
        </Link>
        <Link
          to="/student/events?enrolled=true"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ECDC4]/10 hover:bg-[#4ECDC4]/20 border border-[#4ECDC4]/30 rounded-lg text-sm text-[#4ECDC4] transition-colors"
        >
          <Award size={16} />
          Evenimentele mele
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <EventFilters
          filters={filters}
          onFilterChange={setFilters}
          resultsCount={filteredEvents.length}
        />
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-white/20 border-t-[#4ECDC4] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Se încarcă evenimentele...</p>
          </div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20">
          <Calendar size={48} className="mx-auto text-white/20 mb-4" />
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
              period: 'all',
              location: '',
              faculty: ''
            })}
            className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3dbdb5] transition-colors"
          >
            Resetează filtrele
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredEvents.length > 0 && filteredEvents.length >= 6 && (
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors">
            Încarcă mai multe evenimente
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
