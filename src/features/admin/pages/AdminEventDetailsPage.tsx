import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  Users,
  FileText,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  Loader,
  Loader2,
  AlertTriangle,
  X,
  FileCode,
} from "lucide-react";
import adminService from "../services/adminService";
import AnimatedBackground from "../../../components/AnimatedBackground";

// Interfețe
interface EventFile {
  id_file: number;
  file_path: string;
  original_name?: string;
  is_cover: boolean;
  size?: number;
  type?: string;
}

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  category: string;
  imageUrl?: string;
  participantsCount: number;
  maxParticipants: number;
  status: string;
  submissionDate?: string;
  files: EventFile[];
}

const AdminEventDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  // State pentru Preview Imagine
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) fetchEventData(eventId);
  }, [eventId]);

  const getFileUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const BASE_URL =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:3001";
    return `${BASE_URL}/${path.startsWith("/") ? path.substring(1) : path}`;
  };

  const isImageFile = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(
      ext || ""
    );
  };

  const fetchEventData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: any = await adminService.getEventDetails(id);

      if (!data || !data.id_event)
        throw new Error("Date invalide primite de la server.");

      // Procesare fișiere
      const rawFiles = Array.isArray(data.files) ? data.files : [];
      const processedFiles = rawFiles.map((f: any) => ({
        id_file: f.id_file,
        file_path: f.file_path,
        original_name:
          f.original_name ||
          (f.file_path ? f.file_path.split("/").pop() : "Fisier"),
        is_cover: f.is_cover,
        size: f.size || 0,
        type: f.original_name ? f.original_name.split(".").pop() : "unknown",
      }));

      const cover = processedFiles.find((f: any) => f.is_cover);
      const imageUrl = cover
        ? getFileUrl(cover.file_path)
        : data.image_url
        ? getFileUrl(data.image_url)
        : undefined;

      setEvent({
        id: data.id_event.toString(),
        title: data.title || data.name || "Fără Titlu",
        description: data.description || "Fără descriere",
        date: data.date_start,
        time:
          data.time_start ||
          (data.date_start
            ? new Date(data.date_start).toLocaleTimeString("ro-RO", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Europe/Bucharest",
              })
            : "--:--"),
        location: data.location || "Online",
        organizerName:
          data.organizer_name ||
          data.users?.organization_name ||
          (data.users
            ? `${data.users.first_name || ""} ${
                data.users.last_name || ""
              }`.trim()
            : "Organizator"),
        organizerEmail: data.users?.email || "N/A",
        category: data.event_types?.name || data.category || "General",
        imageUrl,
        participantsCount: data.registrations
          ? data.registrations.length
          : data._count?.registrations || 0,
        maxParticipants: (data.max_participants ?? data.maxParticipants ?? 0) as number,
        status: data.status,
        submissionDate: data.created_at,
        files: processedFiles.filter((f: any) => !f.is_cover),
      });
    } catch (err: any) {
      console.error(err);
      setError(
        "Nu s-a putut încărca evenimentul. Verifică conexiunea sau drepturile de acces."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: "approve" | "reject") => {
    if (!event) return;
    setIsProcessing(true);
    try {
      if (action === "approve")
        await adminService.approveEvent(Number(event.id));
      else await adminService.rejectEvent(Number(event.id), rejectReason);

      // ✅ După acțiune, ne întoarcem la pagina anterioară (lista de cereri)
      navigate(-1);
    } catch (err) {
      alert("Eroare la procesarea acțiunii.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ HANDLER PENTRU BUTONUL ÎNAPOI
  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1023]">
        <Loader className="animate-spin text-[#a78bfa] w-10 h-10" />
      </div>
    );

  if (error || !event)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1023] text-white gap-4">
        <AlertTriangle size={48} className="text-red-400" />
        <h2 className="text-xl font-bold">Eroare încărcare eveniment</h2>
        <p className="text-white/60">{error}</p>
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
        >
          Înapoi
        </button>
      </div>
    );

  // Category colors (same as student page)
  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    workshop: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
    conferinta: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
    hackathon: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
    seminar: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
    targ: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30" },
    competitie: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
    training: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
    networking: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
    altele: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" },
  };

  const categoryKey = event.category?.toLowerCase() || "altele";
  const colors = categoryColors[categoryKey] || categoryColors["altele"];

  const formatRoDateTime = (dateStr: string, mode: "date" | "time") => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions =
      mode === "date"
        ? { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Bucharest" }
        : { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Bucharest" };
    return new Intl.DateTimeFormat("ro-RO", options).format(date);
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-4 pb-12 px-4 relative animate-fade-in">
      <AnimatedBackground />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} /> Înapoi
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image - Student Style */}
            <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#0f0c29]">
              <img
                src={event.imageUrl || "/assets/events/default.png"}
                alt={event.title}
                className="w-full h-64 md:h-96 object-cover cursor-pointer"
                onClick={() => event.imageUrl && setPreviewImage(event.imageUrl)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-transparent opacity-80" />
              <span
                className={`absolute top-4 left-4 px-4 py-1.5 text-sm font-semibold rounded-full ${colors.bg} ${colors.text} border ${colors.border} backdrop-blur-md`}
              >
                {event.category}
              </span>
            </div>

            {/* Title & Description */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                {event.title}
              </h1>
              <div className="prose prose-invert max-w-none text-white/80 whitespace-pre-line leading-relaxed">
                {event.description}
              </div>
            </div>

            {/* Files Section - Student Style */}
            {event.files.length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="text-[#a78bfa]" /> Materiale
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.files.map((file) => {
                    const fileUrl = getFileUrl(file.file_path);
                    const fileName = file.original_name || file.file_path?.split("/").pop() || "Material";
                    const isImage = isImageFile(fileName);
                    const isPdf = /\.pdf$/i.test(fileName);

                    return (
                      <div
                        key={file.id_file}
                        className="group relative bg-[#1a1a2e] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#a78bfa]/50 transition-all"
                        onClick={() => setPreviewImage(fileUrl)}
                      >
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
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileCode size={48} className="text-white/20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                              <Eye size={24} className="text-white" />
                            </div>
                          </div>
                        </div>
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

          {/* Right Column: Sidebar - Student Style + Admin Panel */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl sticky top-0">
              {/* Admin Status Badge */}
              <div className="mb-5">
                <div className="flex items-center gap-2 text-xs text-white/40 font-bold uppercase tracking-wider mb-2">
                  <Shield size={14} /> Status
                </div>
                <div
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold border ${
                    event.status === "active"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : event.status === "pending"
                      ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {event.status === "active" ? (
                    <CheckCircle size={20} />
                  ) : event.status === "pending" ? (
                    <Clock size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  {event.status === "active"
                    ? "Publicat"
                    : event.status === "pending"
                    ? "În Așteptare"
                    : "Respins"}
                </div>
              </div>

              {/* Info Cards - Student Style */}
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
                    {event.time}
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
                    {event.participantsCount}/
                    {event.maxParticipants > 0 ? event.maxParticipants : "Nelimitat"}
                  </div>
                </div>
              </div>

              {/* Organizer Info */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {event.organizerName?.charAt(0) || <User size={20} />}
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold">ORGANIZATOR</p>
                  <p className="text-white text-sm">{event.organizerName}</p>
                  <p className="text-xs text-white/40 truncate max-w-[150px]" title={event.organizerEmail}>
                    {event.organizerEmail}
                  </p>
                </div>
              </div>

              {/* Admin Action Buttons */}
              {(event.status === "pending" || event.status === "draft") && (
                <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
                  <button
                    onClick={() => handleAction("approve")}
                    disabled={isProcessing}
                    className="w-full flex justify-center items-center gap-2 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 font-bold shadow-lg hover:shadow-green-500/30 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <CheckCircle size={18} />
                    )}{" "}
                    Aprobă Eveniment
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isProcessing}
                    className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 font-bold hover:bg-red-500/20 transition-all"
                  >
                    <XCircle size={18} /> Respinge
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal - Student Style */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-20"
            onClick={() => setPreviewImage(null)}
            title="Închide"
          >
            <X size={24} />
          </button>
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1a1625] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all scale-100">
            <h3 className="text-xl font-bold mb-2">Motivul Respingerii</h3>
            <p className="text-white/60 text-sm mb-4">
              Te rugăm să specifici de ce respingi acest eveniment.
              Organizatorul va primi acest mesaj.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-32 bg-[#0b0f1f] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-red-500/50 mb-6 resize-none placeholder:text-white/20"
              placeholder="Ex: Descriere incompletă, imagine necorespunzătoare..."
            ></textarea>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition-colors border border-white/5"
              >
                Anulează
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={!rejectReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-600 font-bold shadow-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirmă
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventDetailsPage;
