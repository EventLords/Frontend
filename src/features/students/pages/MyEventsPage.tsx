import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  Star,
  CheckCircle,
  MessageSquare,
  X,
  Send,
  Award,
  ArrowLeft,
  Eye,
} from "lucide-react";

import { StudentEvent } from "../../../types/student";
import { studentEventsService } from "../services/eventsService";
import { enrollmentService } from "../services/enrollmentService";
import { mapApiEventToStudentEvent } from "../services/event.mapper";

// Extindem tipul StudentEvent pentru proprietățile specifice participării
interface ExtendedEvent extends StudentEvent {
  attendedAt?: string;
  hasReview?: boolean;
  userReview?: {
    rating: number;
    comment: string;
    created_at: string;
  };
}

const MyEventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "attended">(
    "upcoming"
  );
  const [upcomingEvents, setUpcomingEvents] = useState<ExtendedEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<ExtendedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // Review & Preview state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEvent | null>(
    null
  );
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setIsLoading(true);
    try {
      // ✅ LOGICĂ SENIOR: Preluăm simultan înscrierile și feedback-urile
      const [enrollments, myFeedbacks] = await Promise.all([
        enrollmentService.getMyEnrollments(),
        studentEventsService.getMyFeedback(),
      ]);

      const now = new Date();
      const upcoming: ExtendedEvent[] = [];
      const attended: ExtendedEvent[] = [];

      enrollments.forEach((enrollment: any) => {
        const rawEvent = enrollment.events || enrollment.event;
        if (!rawEvent) return;

        // ✅ REZOLVARE POZE: Aplicăm mapper-ul oficial pentru a reconstrui URL-ul imaginii (port 3001)
        const mappedBase = mapApiEventToStudentEvent(rawEvent);

        const eventDate = new Date(rawEvent.date_start);
        const isPast = eventDate < now || enrollment.checked_in;

        const mappedEvent: ExtendedEvent = {
          ...mappedBase,
          isEnrolled: true,
          attendedAt: isPast ? rawEvent.date_start : undefined,
          hasReview: false,
        };

        // Verificăm feedback-ul existent
        const feedback = myFeedbacks.find(
          (f: any) => String(f.event_id) === mappedEvent.id
        );

        if (feedback) {
          mappedEvent.hasReview = true;
          mappedEvent.userReview = {
            rating: feedback.rating,
            comment: feedback.comment || "",
            created_at: feedback.created_at,
          };
        }

        if (isPast) {
          attended.push(mappedEvent);
        } else {
          upcoming.push(mappedEvent);
        }
      });

      setUpcomingEvents(upcoming);
      setAttendedEvents(attended);
    } catch (err) {
      console.error("Failed to load events", err);
      setError("Nu am putut încărca evenimentele.");
    } finally {
      setIsLoading(false);
    }
  };

  const openReviewModal = (event: ExtendedEvent) => {
    setSelectedEvent(event);
    if (event.userReview) {
      setReviewRating(event.userReview.rating);
      setReviewComment(event.userReview.comment);
    } else {
      setReviewRating(0);
      setReviewComment("");
    }
    setReviewSubmitted(false);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedEvent || reviewRating === 0) return;
    setIsSubmitting(true);
    try {
      await studentEventsService.submitFeedback({
        event_id: Number(selectedEvent.id),
        rating: reviewRating,
        comment: reviewComment,
      });

      setAttendedEvents((prev) =>
        prev.map((ev) =>
          ev.id === selectedEvent.id
            ? {
                ...ev,
                hasReview: true,
                userReview: {
                  rating: reviewRating,
                  comment: reviewComment,
                  created_at: new Date().toISOString(),
                },
              }
            : ev
        )
      );

      setReviewSubmitted(true);
      setTimeout(() => setShowReviewModal(false), 1500);
    } catch (err: any) {
      alert(err.message || "Eroare la trimiterea feedback-ului");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const StarRating = ({
    rating,
    interactive = false,
    size = 24,
  }: {
    rating: number;
    interactive?: boolean;
    size?: number;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setReviewRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
          } transition-transform`}
        >
          <Star
            size={size}
            className={`${
              star <= (interactive ? hoverRating || reviewRating : rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/30"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-white">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Evenimentele Mele</h1>
          <Link
            to="/student/dashboard"
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> <span>Înapoi la dashboard</span>
          </Link>
        </div>
        <p className="text-white/60">
          Urmărește participările tale și oferă feedback.
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
            activeTab === "upcoming"
              ? "bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white shadow-lg"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Calendar size={18} /> Viitoare ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("attended")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
            activeTab === "attended"
              ? "bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white shadow-lg"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Award size={18} /> Participări ({attendedEvents.length})
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-3 border-white/20 border-t-[#a78bfa] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {(activeTab === "upcoming" ? upcomingEvents : attendedEvents)
            .length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <CheckCircle size={48} className="mx-auto text-white/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Nicio activitate în acest tab
              </h3>
            </div>
          ) : (
            (activeTab === "upcoming" ? upcomingEvents : attendedEvents).map(
              (event) => (
                <div
                  key={event.id}
                  className="bg-[#1a1c35]/60 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-[#a78bfa]/40 transition-all group shadow-sm"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-40 md:h-auto flex-shrink-0 bg-black/40 relative overflow-hidden">
                      {/* ✅ AFIȘARE IMAGINE COPERTĂ */}
                      <img
                        src={event.image || "/assets/events/default.png"}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "/assets/events/default.png")
                        }
                      />
                      <div
                        onClick={() => setPreviewImage(event.image || null)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20 text-xs font-bold">
                          <Eye size={14} /> Previzualizare
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${
                                activeTab === "attended"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {activeTab === "attended"
                                ? "Participat"
                                : "Înscris"}
                            </span>
                            <span className="text-white/40 text-sm flex items-center gap-1.5 font-medium">
                              <Calendar size={14} />{" "}
                              {formatDate(
                                activeTab === "attended"
                                  ? event.attendedAt
                                  : event.date
                              )}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-[#a78bfa] transition-colors">
                            {event.name}
                          </h3>
                          <p className="text-white/40 text-sm mb-4 line-clamp-1">
                            {event.location}
                          </p>
                          {event.hasReview &&
                            event.userReview &&
                            activeTab === "attended" && (
                              <div className="bg-white/5 rounded-xl p-4 border border-white/5 mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <StarRating
                                    rating={event.userReview.rating}
                                    size={14}
                                  />
                                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-tighter">
                                    Review-ul tău
                                  </span>
                                </div>
                                <p className="text-white/70 text-sm italic leading-relaxed">
                                  "{event.userReview.comment}"
                                </p>
                              </div>
                            )}
                        </div>
                        <div className="flex flex-row lg:flex-col gap-2 mt-2 lg:mt-0">
                          {activeTab === "attended" ? (
                            <button
                              onClick={() => openReviewModal(event)}
                              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                event.hasReview
                                  ? "bg-white/5 text-white/60 hover:bg-white/10"
                                  : "bg-[#a78bfa] text-white hover:bg-[#8b5cf6]"
                              }`}
                            >
                              {event.hasReview ? (
                                <>
                                  <MessageSquare size={16} /> Editează
                                </>
                              ) : (
                                <>
                                  <Star size={16} /> Lasă Feedback
                                </>
                              )}
                            </button>
                          ) : (
                            <Link
                              to={`/student/events/${event.id}`}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10"
                            >
                              Detalii <ChevronRight size={16} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-all">
            <X size={40} />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
          />
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#12162a] border border-[#a78bfa]/40 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            {reviewSubmitted ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-bold">Mulțumim!</h3>
                <p className="text-white/50">
                  Feedback-ul tău a fost înregistrat.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-1">
                  {selectedEvent.hasReview
                    ? "Editează Feedback"
                    : "Feedback Eveniment"}
                </h3>
                <p className="text-white/40 text-sm mb-8 italic">
                  {selectedEvent.name}
                </p>
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3">
                      Rating-ul tău
                    </p>
                    <StarRating rating={reviewRating} interactive size={36} />
                  </div>
                  <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3">
                      Mesajul tău
                    </p>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Cum a fost experiența ta?"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#a78bfa] transition-all resize-none shadow-inner"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10"
                    >
                      Anulează
                    </button>
                    <button
                      onClick={submitReview}
                      disabled={isSubmitting || reviewRating === 0}
                      className="flex-1 py-4 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white font-bold rounded-2xl shadow-lg disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        "Se trimite..."
                      ) : (
                        <>
                          <Send size={20} /> Trimite
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
