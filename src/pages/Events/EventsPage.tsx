import React, { useState, useEffect } from "react";
import { Calendar, Search, Loader } from "lucide-react";
import {
  EventFiltersBar,
  PublicEventCard,
  EventFiltersState,
  PublicEvent,
} from "../../components/events";
import "./EventsPage.css";

// Import service
import { studentEventsService } from "../../features/students/services/eventsService";
import { StudentEvent } from "../../types/student";

// Helper to map StudentEvent (from service) to PublicEvent (for component)
const mapStudentEventToPublicEvent = (e: StudentEvent): PublicEvent => ({
  id: e.id,
  title: e.name,
  description: e.description,
  date: e.date,
  time: e.time,
  location: e.location,
  organizer: e.organizer.name,
  participants: e.currentParticipants,
  maxParticipants: e.maxParticipants,
  category: e.category,
  imageUrl: e.image,
});

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Corrected: Removed 'type' property
  const [filters, setFilters] = useState<EventFiltersState>({
    search: "",
    category: "all",
    location: "all",
    period: "upcoming",
  });
  const [displayCount, setDisplayCount] = useState(6);

  // 1. Fetch Unique Locations Once on Mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locs = await studentEventsService.getUniqueLocations();
        setLocations(locs);
      } catch (e) {
        console.error("Failed to load locations", e);
      }
    };
    fetchLocations();
  }, []);

  // 2. Fetch events whenever filters change
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const serviceFilters: any = {};

        if (filters.search) serviceFilters.search = filters.search;

        // Map category 'all' to undefined for service
        if (filters.category !== "all")
          serviceFilters.category = filters.category;

        // Map location 'all' to undefined
        if (filters.location !== "all")
          serviceFilters.location = filters.location;

        // Map period 'all' to undefined, but others pass through
        if (filters.period !== "all") serviceFilters.period = filters.period;

        // Call the service
        const data = await studentEventsService.getAllEvents(serviceFilters);

        // Map and set data
        const mappedEvents = data.map(mapStudentEventToPublicEvent);
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid spamming API
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="min-h-screen pt-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Descoperă Evenimente
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Găsește evenimentele universitare care te interesează și înscrie-te
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <EventFiltersBar
            filters={filters}
            onFilterChange={setFilters}
            resultsCount={events.length}
            availableLocations={locations} // ✅ Pass dynamic locations here
          />
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 text-[#a78bfa] animate-spin mx-auto mb-4" />
              <p className="text-white/60">Se încarcă evenimentele...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nu s-au găsit evenimente
            </h3>
            <p className="text-white/60 mb-4">
              Încearcă să modifici filtrele pentru a găsi evenimente
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  category: "all",
                  location: "all",
                  period: "upcoming", // Reset to upcoming by default
                })
              }
              className="px-4 py-2 bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f] font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all"
            >
              Resetează filtrele
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, displayCount).map((event) => (
                <PublicEventCard key={event.id} event={event} />
              ))}
            </div>
            {events.length > displayCount && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setDisplayCount((prev) => prev + 6)}
                  className="px-6 py-3 bg-gradient-to-r from-[#a78bfa]/15 to-[#8b5cf6]/10 text-[#c4b5fd] font-semibold rounded-xl border border-[#a78bfa]/35 hover:border-[#a78bfa]/55 hover:bg-[#a78bfa]/20 hover:text-white transition-all hover:-translate-y-1"
                >
                  Vezi mai multe evenimente
                </button>
              </div>
            )}
          </>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-2xl p-6 text-center">
          <Calendar size={32} className="mx-auto text-[#c4b5fd] mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Vrei să participi la evenimente?
          </h3>
          <p className="text-white/70 mb-4">
            Creează un cont gratuit pentru a te înscrie la evenimente și a primi notificări
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f] font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
          >
            Creează cont gratuit
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
