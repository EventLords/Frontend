// src/features/students/pages/StudentDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Clock, Award, Search, Filter } from 'lucide-react';

// 🛑 IMPORTURILE TALE ORIGINALE RESTAURATE:
import EventFilters from '../components/EventFilters';
import EventCard from '../components/EventCard';   // Am presupus calea exactă
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
    
  // Culorile pentru gradientul de fundal (păstrăm estetica)
  const darkBgColor = '#3F3176';
  const secondaryColor = '#7B6DB5';
  const highlightColor = '#e386ffff';

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Folosește serviciul tău real pentru a prelua evenimentele
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
      setIsLoading(true);
      try {
        // Folosește serviciul tău real pentru a filtra evenimentele
        const filtered = await studentEventsService.getAllEvents(filters);
        setFilteredEvents(filtered);
      } catch (error) {
          console.error('Error applying filters:', error);
      } finally {
          setIsLoading(false);
      }
    };
    applyFilters();
  }, [filters]);


  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    suffix?: string;
    color: string;
    linkTo: string; // Am adăugat linkTo
  }> = ({ icon, label, value, suffix, color, linkTo }) => (
    <Link 
        to={linkTo} 
        className={`${color} rounded-xl p-4 border border-white/10 transition-transform hover:scale-[1.02] shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
        <div>
          <p className="text-2xl font-bold text-white">
            {value}{suffix}
          </p>
          <p className="text-sm text-white/60">{label}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div 
        className="min-h-screen text-white" 
        style={{ 
            backgroundColor: darkBgColor, 
            backgroundImage: `radial-gradient(at top center, ${secondaryColor} 0%, ${darkBgColor} 70%, #171738 100%)`,
        }}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8 md:pt-16">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
                Descoperă evenimente
            </h1>
            <p className="text-lg text-white/70">
                Găsește și înscrie-te la evenimentele universitare care te interesează
            </p>
          </div>

          {/* Stats Cards (Linkurile corectate) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Calendar size={20} className="text-blue-400" />}
              label="Înscris la"
              value={stats.enrolledEvents}
              suffix=" evenimente"
              color="bg-blue-500/10"
                linkTo="/student/evenimentele-mele" 
            />
            <StatCard
              icon={<TrendingUp size={20} className="text-green-400" />}
              label="Viitoare"
              value={stats.upcomingEvents}
              suffix=" evenimente"
              color="bg-green-500/10"
                linkTo="/student/calendar" 
            />
            <StatCard
              icon={<Award size={20} className="text-purple-400" />}
              label="Completate"
              value={stats.completedEvents}
              suffix=" evenimente"
              color="bg-purple-500/10"
                linkTo="/student/profile?tab=history" 
            />
            <StatCard
              icon={<Clock size={20} className="text-orange-400" />}
              label="Total ore"
              value={stats.totalHours}
              suffix="h"
              color="bg-orange-500/10"
                linkTo="/student/profile?tab=stats" 
            />
          </div>

          {/* Quick Links (Linkul corectat) */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              to="/student/calendar"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors"
            >
              <Calendar size={16} />
              Vezi calendarul
            </Link>
            <Link
              to="/student/evenimentele-mele" 
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-colors`}
                style={{ color: highlightColor }}
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
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
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
            // Afișează evenimentele folosind componenta ta EventCard
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Load More */}
          {/* ... (restul logicii de Load More) ... */}
        </div>
    </div>
  );
};

export default StudentDashboard;