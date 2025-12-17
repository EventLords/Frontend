// src/features/students/pages/EventDetailsPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Share2, 
  Heart,
  CheckCircle,
  Ticket,
  User
} from 'lucide-react';
import { studentEventsService } from '../services/eventsService';
import { enrollmentService } from '../services/enrollmentService';
import { studentNotificationsService } from '../services/notificationsService';
import { QRModal } from '../components';
import { StudentEvent, Enrollment, EventCategory } from '../../../types/student';

const categoryColors: Record<EventCategory, { bg: string; text: string; border: string }> = {
  workshop: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  conferinta: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  hackathon: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  seminar: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  targ: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  competitie: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  training: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  networking: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  altele: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
};

const categoryLabels: Record<EventCategory, string> = {
  workshop: 'Workshop',
  conferinta: 'Conferință',
  hackathon: 'Hackathon',
  seminar: 'Seminar',
  targ: 'Târg',
  competitie: 'Competiție',
  training: 'Training',
  networking: 'Networking',
  altele: 'Altele',
};

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<StudentEvent | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      
      setIsLoading(true);
      try {
        const [eventData, enrollmentData] = await Promise.all([
          studentEventsService.getEventById(eventId),
          enrollmentService.getEnrollmentByEventId(eventId)
        ]);
        
        setEvent(eventData);
        setEnrollment(enrollmentData);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [eventId]);

  const handleEnroll = async () => {
    if (!event || !eventId) return;
    
    setIsEnrolling(true);
    try {
      const newEnrollment = await enrollmentService.enrollInEvent(eventId, event);
      setEnrollment(newEnrollment);
      
      // Create notification
      await studentNotificationsService.createEnrollmentNotification(eventId, event.name);
      
      // Schedule reminder
      studentNotificationsService.scheduleReminder(eventId, event.name, event.date, event.time);
      
      // Show QR modal
      setShowQRModal(true);
      
      // Update event state
      setEvent(prev => prev ? { ...prev, isEnrolled: true, currentParticipants: prev.currentParticipants + 1 } : null);
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('A apărut o eroare la înscriere. Te rugăm să încerci din nou.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleSendEmail = async (email: string) => {
    if (!enrollment) return false;
    return await enrollmentService.sendQRToEmail(enrollment.id, email);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-white/20 border-t-[#4ECDC4] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Eveniment negăsit</h2>
        <p className="text-white/60 mb-6">Evenimentul pe care îl cauți nu există sau a fost șters.</p>
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3dbdb5] transition-colors"
        >
          <ArrowLeft size={18} />
          Înapoi la evenimente
        </Link>
      </div>
    );
  }

  const colors = categoryColors[event.category];
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isFull = spotsLeft <= 0;
  const isEnrolled = enrollment?.status === 'confirmed' || event.isEnrolled;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Înapoi
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Category Badge */}
            <span className={`absolute top-4 left-4 px-4 py-1.5 text-sm font-semibold rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
              {categoryLabels[event.category]}
            </span>

            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors">
                <Share2 size={18} />
              </button>
            </div>

            {/* Enrolled Badge */}
            {isEnrolled && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-green-500/90 text-white rounded-full">
                <CheckCircle size={18} />
                <span className="font-semibold">Înscris</span>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {event.name}
            </h1>
            <p className="text-white/70 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm text-white/60 bg-white/5 rounded-lg border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Agendă</h2>
              <div className="space-y-4">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0 w-16 text-sm font-medium text-[#4ECDC4]">
                      {item.time}
                    </div>
                    <div className="flex-1 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                      <h3 className="font-medium text-white">{item.title}</h3>
                      {item.speaker && (
                        <p className="text-sm text-white/60 mt-1">
                          <User size={12} className="inline mr-1" />
                          {item.speaker}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm text-white/50 mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info Card */}
          <div className="bg-[#4ECDC4]/10 rounded-2xl border border-[#4ECDC4]/30 p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-[#4ECDC4] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/60">Data</p>
                  <p className="font-medium text-white">{formatDate(event.date)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[#4ECDC4] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/60">Ora</p>
                  <p className="font-medium text-white">
                    {event.time}
                    {event.endTime && ` - ${event.endTime}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#4ECDC4] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/60">Locație</p>
                  <p className="font-medium text-white">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users size={20} className="text-[#4ECDC4] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/60">Participanți</p>
                  <p className="font-medium text-white">
                    {event.currentParticipants} / {event.maxParticipants}
                  </p>
                  {!isFull && spotsLeft <= 10 && (
                    <p className="text-xs text-yellow-400 mt-1">
                      Doar {spotsLeft} locuri rămase!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isFull ? 'bg-red-500' : 'bg-[#4ECDC4]'
                  }`}
                  style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                />
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              {isEnrolled ? (
                <button
                  onClick={() => setShowQRModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Ticket size={20} />
                  Vezi biletul digital
                </button>
              ) : isFull ? (
                <button
                  disabled
                  className="w-full px-6 py-3 bg-gray-500/50 text-white/60 font-semibold rounded-xl cursor-not-allowed"
                >
                  Eveniment complet
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#4ECDC4] text-white font-semibold rounded-xl hover:bg-[#3dbdb5] transition-colors disabled:opacity-50"
                >
                  {isEnrolling ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Se procesează...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Înscrie-te la eveniment
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Organizer Card */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-medium text-white/60 mb-3">Organizator</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {event.organizer.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">{event.organizer.name}</p>
                <p className="text-sm text-white/60">{event.faculty}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {event && (
        <QRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          enrollment={enrollment}
          event={event}
          userEmail="alexandru.popescu@student.usv.ro"
          onSendEmail={handleSendEmail}
        />
      )}
    </div>
  );
};

export default EventDetailsPage;