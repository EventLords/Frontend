import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FileText, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { Event, DashboardStats } from '../../../types/organizer';

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    activeEvents: 0,
    totalParticipants: 0,
    uploadedMaterials: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; eventId: string; eventName: string }>({
    isOpen: false,
    eventId: '',
    eventName: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventsData, statsData] = await Promise.all([
          eventsService.getAllEvents(),
          eventsService.getDashboardStats()
        ]);
        setEvents(eventsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const openDeleteModal = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, eventId: id, eventName: name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, eventId: '', eventName: '' });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await eventsService.deleteEvent(deleteModal.eventId);
      setEvents(prev => prev.filter(e => e.id !== deleteModal.eventId));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const StatCard: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: number; 
  }> = ({ icon, label, value }) => (
    <div className="bg-[#2a2a5e]/80 rounded-xl p-5 border border-white/10 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-white/80">{icon}</div>
        <span className="text-white/80 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-12 student-main-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Header cu culorile turcoaz alese de tine */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-[#4ECDC4]">
              Gestionează-ți evenimentele universitare
            </h1>
            <p className="text-[#4ECDC4]/80 text-sm font-medium">
              Panou de control organizator
            </p>
          </div>
          <Link
            to="/organizer/events/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4ECDC4] text-[#171738] font-bold rounded-lg hover:bg-[#3dbdb5] transition-colors text-sm shadow-lg"
          >
            <Plus size={18} />
            Eveniment Nou
          </Link>
        </div>

        {/* Stats Cards conform stilului original */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard 
            icon={<Calendar size={20} />}
            label="Evenimente active"
            value={stats.activeEvents}
          />
          <StatCard 
            icon={<Users size={20} />}
            label="Participanți total"
            value={stats.totalParticipants}
          />
          <StatCard 
            icon={<FileText size={20} />}
            label="Materiale încărcate"
            value={stats.uploadedMaterials}
          />
        </div>

        {/* Lista de Evenimente refăcută exact ca în imaginea ta */}
        <div className="bg-[#1e1e4a]/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Evenimentele Mele</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-white/60">Se încarcă...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <Calendar size={40} className="mx-auto mb-3 opacity-50" />
              <p>Nu ai niciun eveniment încă.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className="px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {event.name}
                        </h3>
                        <span 
                          className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            event.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {event.status === 'active' ? 'Activ' : 'Inactiv'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(event.date).toLocaleDateString('ro-RO')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {event.currentParticipants} participanți
                        </span>
                      </div>
                    </div>

                    {/* Butoanele de acțiune originale din imaginea ta */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => navigate(`/organizer/events/${event.id}/participants`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                      >
                        <Eye size={14} />
                        Vezi participanți
                      </button>
                      <button
                        onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                      >
                        <Edit3 size={14} />
                        Editează
                      </button>
                      <button
                        onClick={() => openDeleteModal(event.id, event.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/10"
                      >
                        <Trash2 size={14} />
                        Șterge
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Ștergere */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#171738] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Șterge evenimentul?</h3>
            <div className="flex gap-3">
               <button onClick={closeDeleteModal} className="flex-1 py-2 bg-white/5 text-white rounded-xl">Anulează</button>
               <button onClick={handleConfirmDelete} className="flex-1 py-2 bg-red-500 text-white font-bold rounded-xl">Șterge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;