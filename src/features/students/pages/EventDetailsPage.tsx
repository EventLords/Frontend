import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  FileText,
  Share2,
  Heart,
  Ticket,
  CheckCircle,
  AlertTriangle,
  X,
  Copy,
  Mail,
  User,
  Star,
  LogOut,
  FileCode,
  Eye,
} from "lucide-react";

// Services
import { studentEventsService } from "../services/eventsService";
import { enrollmentService } from "../services/enrollmentService";

// Types
import { StudentEvent, Enrollment } from "../../../types/student";
import AnimatedBackground from "../../../components/AnimatedBackground";

// Components
import QRModal from "../components/QRModal";
import FeedbackModal from "../components/FeedbackModal";

// --- COLORS CONFIG ---
const categoryColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  workshop: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  conferinta: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  hackathon: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
  seminar: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
  },
  targ: {
    bg: "bg-pink-500/20",
    text: "text-pink-400",
    border: "border-pink-500/30",
  },
  competitie: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  training: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  networking: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
  },
  altele: {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
    border: "border-gray-500/30",
  },
};

const categoryLabels: Record<string, string> = {
  workshop: "Workshop",
  conferinta: "Conferință",
  hackathon: "Hackathon",
  seminar: "Seminar",
  targ: "Târg",
  competitie: "Competiție",
  training: "Training",
  networking: "Networking",
  altele: "Altele",
};

// --- MODAL HELPERS ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#1a1040] border border-white/10 rounded-2xl shadow-2xl p-6 text-center transform scale-100 transition-all">
        <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 mb-6 text-sm">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10 font-medium transition-colors"
          >
            Anulează
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
          >
            Confirmă
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose, title, message }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#1a1040] border border-white/10 rounded-2xl shadow-2xl p-6 text-center">
        <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={24} className="text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 mb-6 text-sm">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<StudentEvent | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showSuccessCancel, setShowSuccessCancel] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [hasLeftFeedback, setHasLeftFeedback] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showEventFullModal, setShowEventFullModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      setIsLoading(true);
      setError(null);
      try {
        const eventData = await studentEventsService.getEventById(eventId);
        setEvent(eventData);

        const favorites = JSON.parse(
          localStorage.getItem("favoriteEvents") || "[]"
        );
        setIsFavorite(favorites.includes(eventId));

        const enrollmentData = await enrollmentService.getEnrollmentByEventId(
          eventId
        );
        setEnrollment(enrollmentData);

        const myFeedbacks = await studentEventsService.getMyFeedback();
        const existing = myFeedbacks.find(
          (f: any) => String(f.event_id) === String(eventId)
        );
        if (existing) setHasLeftFeedback(true);
      } catch (err: any) {
        console.error("Error fetching event:", err);
        setError("Nu am putut încărca evenimentul.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    if (!eventId) return;
    try {
      await studentEventsService.submitFeedback({
        event_id: Number(eventId),
        rating,
        comment,
      });
      setHasLeftFeedback(true);
      setShowFeedbackModal(false);
    } catch (err: any) {
      alert(err.message || "Eroare la trimiterea feedback-ului.");
    }
  };

  const formatRoDateTime = (dateStr: string, mode: "date" | "time") => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions =
      mode === "date"
        ? {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Europe/Bucharest",
          }
        : {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Europe/Bucharest",
          };
    return new Intl.DateTimeFormat("ro-RO", options).format(date);
  };

  const getFileUrl = (path: string) => {
    if (!path) return "";
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
    return `${apiBase.replace("/api", "")}/uploads/${path
      .replace(/\\/g, "/")
      .split("uploads/")
      .pop()}`;
  };

  const handleEnroll = async () => {
    if (!event || !eventId) return;
    setIsEnrolling(true);
    try {
      const newEnrollment = await enrollmentService.enrollInEvent(
        eventId,
        event
      );
      setEnrollment(newEnrollment);
      setShowQRModal(true);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              isEnrolled: true,
              currentParticipants: prev.currentParticipants + 1,
            }
          : null
      );
    } catch (e: any) {
      const msg = (e.message || "").toLowerCase();
      if (msg.includes("plin") || msg.includes("full") || msg.includes("complet")) {
        setShowEventFullModal(true);
      } else {
        setShowEventFullModal(true);
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const executeCancelEnrollment = async () => {
    if (!eventId) return;
    setIsCancelling(true);
    try {
      await enrollmentService.cancelEnrollment(eventId);
      setEnrollment(null);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              isEnrolled: false,
              currentParticipants: Math.max(0, prev.currentParticipants - 1),
            }
          : null
      );
      setShowSuccessCancel(true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsCancelling(false);
      setShowConfirmCancel(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!eventId || isTogglingFav) return;
    setIsTogglingFav(true);
    try {
      await studentEventsService.toggleFavorite(eventId);
      setIsFavorite(!isFavorite);
    } finally {
      setIsTogglingFav(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.name || "Eveniment",
          text: `Vezi evenimentul: ${event?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      setShowShareMenu(true);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-transparent">
        <div className="w-12 h-12 border-3 border-white/20 border-t-[#a78bfa] rounded-full animate-spin" />
      </div>
    );
  if (error || !event)
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-white bg-transparent">
        <AlertTriangle className="mx-auto mb-4" />
        {error || "Eveniment indisponibil"}
      </div>
    );

  const categoryKey = event.category?.toLowerCase() || "altele";
  const colors = categoryColors[categoryKey] || categoryColors["altele"];

  // ✅ LOGICĂ FEEDBACK (Check-in + Start Eveniment)
  const isCheckedIn =
    enrollment?.checked_in === true || (enrollment as any)?.checkedIn === true;
  // event.date conține acum string-ul ISO complet cu data și ora
  const eventStartDateTime = new Date(event.date);
  const hasEventStarted = new Date() >= eventStartDateTime;
  const canGiveFeedback = isCheckedIn && hasEventStarted;

  return (
    <div className="min-h-screen bg-transparent text-white pt-20 pb-12 px-4 relative animate-fade-in">
      <AnimatedBackground />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} /> Înapoi
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#0f0c29]">
              <img
                src={event.image || "/assets/events/default.png"}
                alt={event.name}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-transparent opacity-80" />
              <span
                className={`absolute top-4 left-4 px-4 py-1.5 text-sm font-semibold rounded-full ${colors.bg} ${colors.text} border ${colors.border} backdrop-blur-md`}
              >
                {categoryLabels[categoryKey] || "Eveniment"}
              </span>
              {/* Action Buttons - Stacked vertically */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFav}
                  className={`p-2.5 rounded-full border transition-all ${
                    isFavorite
                      ? "bg-[#a78bfa] border-[#a78bfa] text-white"
                      : "bg-[#1a1040]/80 backdrop-blur-md border-white/20 text-white hover:bg-[#a78bfa]/50"
                  }`}
                >
                  <Heart size={20} className={isFavorite ? "fill-current" : ""} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-[#1a1040]/80 backdrop-blur-md border border-white/20 text-white hover:bg-[#a78bfa]/50 transition-all"
                >
                  <Share2 size={20} />
                </button>
              </div>
              {enrollment && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-lg">
                  <CheckCircle size={18} />{" "}
                  <span className="font-bold">Ești înscris!</span>
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                {event.name}
              </h1>
              <div className="prose prose-invert max-w-none text-white/80 whitespace-pre-line leading-relaxed">
                {event.description}
              </div>
            </div>

            {event.files && event.files.length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="text-[#a78bfa]" /> Materiale
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.files.map((file: any, idx: number) => {
                    const fileUrl = getFileUrl(file.file_path);
                    const filePath = file.file_path || "";
                    const fileName = file.original_name || filePath.split(/[/\\]/).pop() || "Material";
                    const checkPath = file.original_name || filePath;
                    const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(checkPath);
                    const isPdf = /\.pdf$/i.test(checkPath);

                    return (
                      <div
                        key={idx}
                        className="group relative bg-[#1a1a2e] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#a78bfa]/50 transition-all"
                        onClick={() => setPreviewImage(fileUrl)}
                      >
                        {/* Preview Area - Shows actual content */}
                        <div className="h-40 w-full relative overflow-hidden bg-[#0d0d1a]">
                          {isImage ? (
                            <img
                              src={fileUrl}
                              alt={fileName}
                              className="w-full h-full object-cover"
                            />
                          ) : isPdf ? (
                            <iframe
                              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                              title={fileName}
                              className="w-full h-full pointer-events-none"
                              style={{ transform: 'scale(1)', transformOrigin: 'top left' }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileCode size={48} className="text-white/20" />
                            </div>
                          )}

                          {/* Hover Overlay - Only Eye icon */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                              <Eye size={24} className="text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Footer with filename only */}
                        <div className="p-3 bg-[#1a1a2e]">
                          <p className="text-sm font-medium text-white truncate" title={fileName}>
                            {fileName}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl sticky top-24">
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5">
                  <Calendar className="text-[#a78bfa]" />
                  <div>
                    <p className="text-xs text-white/40 font-bold">DATA</p>
                    {formatRoDateTime(event.date, "date")}
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5">
                  <Clock className="text-[#a78bfa]" />
                  <div>
                    <p className="text-xs text-white/40 font-bold">ORA START</p>
                    {formatRoDateTime(event.date, "time")}
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5">
                  <MapPin className="text-[#a78bfa]" />
                  <div>
                    <p className="text-xs text-white/40 font-bold">LOCAȚIE</p>
                    {event.location}
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5">
                  <Users className="text-[#a78bfa]" />
                  <div>
                    <p className="text-xs text-white/40 font-bold">LOCURI</p>
                    {event.currentParticipants}/
                    {typeof event.maxParticipants === "number" && event.maxParticipants > 0
                      ? event.maxParticipants
                      : "Nelimitat"}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {event.organizer?.name?.charAt(0) || <User size={20} />}
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold">ORGANIZATOR</p>
                  <p className="text-white text-sm">
                    {event.organizer?.name || "Nespecificat"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {enrollment ? (
                  <>
                    {canGiveFeedback ? (
                      hasLeftFeedback ? (
                        <div className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold rounded-xl">
                          <CheckCircle size={20} /> Feedback transmis
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowFeedbackModal(true)}
                          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl shadow-lg transition-all animate-fade-in"
                        >
                          <Star size={20} className="fill-black" /> Lasă
                          Feedback
                        </button>
                      )
                    ) : (
                      <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-[11px] text-blue-300">
                          {!isCheckedIn
                            ? "Feedback-ul va fi disponibil după confirmarea prezenței de către organizator."
                            : "Vei putea lăsa feedback imediat ce evenimentul a început."}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => setShowQRModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg transition-all"
                    >
                      <Ticket size={20} /> Vezi Bilet
                    </button>
                    {!isCheckedIn && (
                      <button
                        onClick={() => setShowConfirmCancel(true)}
                        disabled={isCancelling}
                        className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/30 transition-all flex items-center justify-center gap-2 hover:bg-red-500/20"
                      >
                        <LogOut size={18} /> Anulează înscrierea
                      </button>
                    )}
                  </>
                ) : (
                  typeof event.maxParticipants === "number" &&
                  event.maxParticipants > 0 &&
                  event.currentParticipants >= event.maxParticipants ? (
                    <button
                      disabled
                      className="w-full py-4 bg-gradient-to-r from-slate-600 to-slate-500 text-white/70 font-bold rounded-xl cursor-not-allowed opacity-80"
                    >
                      Eveniment complet
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isEnrolling ? "Se procesează..." : "Înscrie-te Acum"}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShareMenu && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1a1040] border border-white/10 rounded-2xl p-6 shadow-2xl relative text-white">
            <button
              onClick={() => setShowShareMenu(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Share2 size={20} className="text-[#a78bfa]" /> Distribuie
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <Copy size={18} /> {copied ? "Copiat!" : "Copiază link-ul"}
              </button>
              <button
                onClick={() =>
                  window.open(
                    `mailto:?subject=Eveniment: ${event?.name}&body=Vezi acest eveniment: ${window.location.href}`
                  )
                }
                className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <Mail size={18} /> Trimite pe Email
              </button>
            </div>
          </div>
        </div>
      )}

      {event && (
        <QRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          enrollment={enrollment}
          event={event}
        />
      )}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        eventTitle={event?.name || "Eveniment"}
      />
      <ConfirmModal
        isOpen={showConfirmCancel}
        onClose={() => setShowConfirmCancel(false)}
        onConfirm={executeCancelEnrollment}
        title="Renunță"
        message="Sigur dorești să anulezi înscrierea?"
      />
      <SuccessModal
        isOpen={showSuccessCancel}
        onClose={() => setShowSuccessCancel(false)}
        title="Succes"
        message="Înscrierea a fost anulată."
      />

      {/* Event Full Modal */}
      {showEventFullModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#1a1040] border border-white/10 rounded-2xl shadow-2xl p-6 text-center transform transition-all animate-fade-in">
            <div className="mx-auto w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
              <Users size={28} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Eveniment complet</h3>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              Toate locurile disponibile pentru acest eveniment au fost ocupate.
            </p>
            <button
              onClick={() => setShowEventFullModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white font-bold transition-all hover:opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-20"
            onClick={() => setPreviewImage(null)}
            title="Închide"
          >
            <X size={24} />
          </button>

          {/* Content Container */}
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {previewImage.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={previewImage}
                title="PDF Preview"
                className="w-full h-[85vh] rounded-xl shadow-2xl bg-white"
              />
            ) : (
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
