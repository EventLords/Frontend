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
    color: string;
  }> = ({ icon, label, value, color }) => (
    <div className={`${color} rounded-xl p-5 border border-white/10`}>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Gestionează-ți evenimentele universitare
          </h1>
        </div>
        <Link
          to="/organizer/events/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4ECDC4] text-white font-medium rounded-lg hover:bg-[#3dbdb5] transition-colors text-sm shadow-lg"
        >
          <Plus size={18} />
          Eveniment Nou
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard 
          icon={<Calendar size={20} />}
          label="Evenimente active"
          value={stats.activeEvents}
          color="bg-[#2a2a5e]/80"
        />
        <StatCard 
          icon={<Users size={20} />}
          label="Participanți total"
          value={stats.totalParticipants}
          color="bg-[#2a2a5e]/80"
        />
        <StatCard 
          icon={<FileText size={20} />}
          label="Materiale încărcate"
          value={stats.uploadedMaterials}
          color="bg-[#2a2a5e]/80"
        />
      </div>

      {/* Events List */}
      <div className="bg-[#1e1e4a]/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Evenimentele Mele</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-white/60">
            <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-3"></div>
            Se încarcă...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-white/60">
            <Calendar size={40} className="mx-auto mb-3 opacity-50" />
            <p>Nu ai niciun eveniment încă.</p>
            <Link 
              to="/organizer/events/create" 
              className="inline-flex items-center gap-1 text-[#4ECDC4] mt-2 hover:underline"
            >
              Creează primul eveniment <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="px-5 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {event.name}
                      </h3>
                      <span 
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          event.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : event.status === 'inactive'
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {event.status === 'active' ? 'Activ' : event.status === 'inactive' ? 'Inactiv' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
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

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => navigate(`/organizer/events/${event.id}/participants`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Eye size={14} />
                      <span className="hidden sm:inline">Vezi participanți</span>
                      <span className="sm:hidden">Participanți</span>
                    </button>
                    <button
                      onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit3 size={14} />
                      <span className="hidden xs:inline">Editează</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(event.id, event.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                      <span className="hidden xs:inline">Șterge</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="relative w-full max-w-md bg-[#1a1a4e] rounded-2xl shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Șterge evenimentul
              </h3>
              <p className="text-white/60 text-sm">
                Ești sigur că vrei să ștergi evenimentul <span className="font-semibold text-white">"{deleteModal.eventName}"</span>? 
                Această acțiune nu poate fi anulată.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                Anulează
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Se șterge...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Șterge
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
