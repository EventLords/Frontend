import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Loader } from "lucide-react";
import { studentEventsService } from "../services/eventsService";
import { StudentEvent } from "../../../types/student";
import EventCard from "../components/EventCard";
import AnimatedBackground from "../../../components/AnimatedBackground";

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favoriteEvents, setFavoriteEvents] = useState<StudentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      // ✅ Apelăm serviciul tău către portul 3001
      const events = await studentEventsService.getFavoriteEvents();
      setFavoriteEvents(events);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGICĂ ȘTERGERE PRIN COȘUL DE GUNOI
  const handleRemoveFavorite = async (eventId: string) => {
    // UI Optimistic: cardul dispare imediat din listă
    setFavoriteEvents((prev) => prev.filter((e) => e.id !== eventId));

    try {
      // Backend: apelăm toggle (va face remove deoarece evenimentul există deja în favorite)
      await studentEventsService.toggleFavorite(eventId);
    } catch (error) {
      console.error("Failed to remove favorite", error);
      // Re-încărcăm lista completă în caz de eroare pentru sincronizare
      loadFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 relative animate-fade-in">
      <AnimatedBackground />
      <div className="max-w-6xl mx-auto relative z-10 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <Heart size={28} className="text-red-400" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Evenimentele mele favorite
              </h1>
              <p className="text-white/60">
                {favoriteEvents.length} activități salvate în listă
              </p>
            </div>
          </div>
          <Link
            to="/student/dashboard"
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> <span>Înapoi</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-[#a78bfa]" />
          </div>
        ) : favoriteEvents.length === 0 ? (
          <div className="bg-[#151632]/60 backdrop-blur-sm rounded-3xl border border-white/5 p-12 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Lista ta de favorite este goală
            </h2>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="mt-6 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-all"
            >
              Explorează Evenimente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteEvents.map((event) => (
              <EventCard
                key={event.id}
                event={{ ...event, isFavorite: true }}
                isFavoritePage={true} // ✅ Activează butonul Trash în loc de Heart
                onRemoveFavorite={handleRemoveFavorite} // ✅ Injectează funcția de ștergere definitivă
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
