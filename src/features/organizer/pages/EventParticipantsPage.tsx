import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Search,
  Download,
  QrCode,
  Loader,
  X,
  Eye,
  MessageSquare,
  Star,
} from "lucide-react";

import eventsService, {
  ApiRegistration,
  FeedbackItem,
} from "../services/eventsService";
import filesService, { EventFile } from "../../../services/filesService";
import QRScannerModal from "../components/QRScannerModal";

const EventParticipantsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<ApiRegistration[]>([]);
  const [files, setFiles] = useState<EventFile[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "present" | "absent" | "files" | "feedback"
  >("all");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Blocăm scroll-ul când e deschis preview-ul (modal full screen)
  useEffect(() => {
    if (previewImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [previewImage]);

  const isImage = (filePath: string) => {
    const extensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
    const ext = filePath.split(".").pop()?.toLowerCase();
    return ext ? extensions.includes(ext) : false;
  };

  const fetchData = useCallback(async () => {
    if (!eventId) return;
    setIsLoading(true);
    try {
      // Încărcăm participanții
      const partsData = await eventsService.getParticipants(Number(eventId));
      setParticipants(partsData);

      // Încărcăm resursele și feedback-ul în paralel
      await Promise.all([
        (async () => {
          setIsLoadingFiles(true);
          try {
            const filesData = await filesService.getEventFiles(Number(eventId));
            setFiles(filesData || []);
          } catch (e) {
            console.error("Eroare fișiere:", e);
          }
          setIsLoadingFiles(false);
        })(),
        (async () => {
          setIsLoadingFeedback(true);
          try {
            const feedbackData = await eventsService.getEventFeedback(
              Number(eventId)
            );
            setFeedback(feedbackData || []);
          } catch (e) {
            console.error("Eroare feedback:", e);
          }
          setIsLoadingFeedback(false);
        })(),
      ]);
    } catch (err: any) {
      console.error("Fetch data error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScan = async (qrTokenRaw: string) => {
    if (!eventId) return;
    try {
      const res = await eventsService.checkInParticipant(
        Number(eventId),
        (qrTokenRaw || "").trim()
      );
      setParticipants((prev) =>
        prev.map((p) =>
          p.id_registration === res.registrationId
            ? { ...p, checked_in: true }
            : p
        )
      );
    } catch (err) {
      throw err;
    }
  };

  const handleManualCheckIn = async (
    registrationId: number,
    qrToken: string
  ) => {
    if (!eventId) return;
    try {
      await eventsService.checkInParticipant(Number(eventId), qrToken);
      setParticipants((prev) =>
        prev.map((p) =>
          p.id_registration === registrationId ? { ...p, checked_in: true } : p
        )
      );
    } catch (err: any) {
      alert(err.message || "Check-in eșuat");
    }
  };

  const handleExport = async () => {
    if (!eventId) return;
    try {
      const blob = await eventsService.exportParticipantsToCSV(Number(eventId));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `participanti_event_${eventId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Export failed");
    }
  };

  const filteredParticipants = participants.filter((p) => {
    if (activeTab === "files" || activeTab === "feedback") return false;
    const matchesSearch =
      `${p.users.first_name} ${p.users.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.users.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      activeTab === "all"
        ? true
        : activeTab === "present"
        ? p.checked_in
        : !p.checked_in;
    return matchesSearch && matchesStatus;
  });

  const total = participants.length;
  const present = participants.filter((p) => p.checked_in).length;
  const absent = total - present;

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-[#a78bfa]">
        <Loader className="animate-spin" size={40} />
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in pb-10 px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Detalii Eveniment
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Gestionează prezența și analizează feedback-ul anonim.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Înapoi
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f] text-sm font-bold rounded-lg shadow-lg active:scale-95 transition-all"
              >
                <QrCode size={16} /> Scanează
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg border border-white/10 transition-all"
              >
                <Download size={16} /> CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total înscriși",
            val: total,
            icon: Users,
            color: "text-purple-400",
          },
          {
            label: "Prezenți",
            val: present,
            icon: Users,
            color: "text-green-400",
          },
          {
            label: "Absenți",
            val: absent,
            icon: Users,
            color: "text-orange-400",
          },
          {
            label: "Recenzii",
            val: feedback.length,
            icon: MessageSquare,
            color: "text-blue-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl p-4 border border-white/5 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.val}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="bg-white/5 p-1 rounded-xl border border-[#a78bfa]/20 inline-flex self-start flex-wrap gap-1">
          {["all", "present", "absent", "files", "feedback"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f] shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab === "feedback"
                ? "Feedback"
                : tab === "files"
                ? "Materiale"
                : tab === "all"
                ? "Toți"
                : tab === "present"
                ? "Prezenți"
                : "Absenți"}
              <span className="ml-1 opacity-70 text-xs">
                {tab === "feedback"
                  ? feedback.length
                  : tab === "files"
                  ? files.length
                  : tab === "all"
                  ? total
                  : tab === "present"
                  ? present
                  : absent}
              </span>
            </button>
          ))}
        </div>
        {activeTab !== "files" && activeTab !== "feedback" && (
          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              size={18}
            />
            <input
              type="text"
              placeholder="Caută participant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-[#a78bfa] outline-none transition-all"
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl min-h-[300px] backdrop-blur-sm">
        {activeTab === "feedback" ? (
          <div className="p-6">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6 flex items-center gap-2">
              <MessageSquare size={14} /> Recenzii Participanți (Anonim)
            </h3>
            {isLoadingFeedback ? (
              <div className="flex justify-center py-12">
                <Loader className="animate-spin text-purple-400" />
              </div>
            ) : feedback.length === 0 ? (
              <div className="text-center py-12 text-white/20 italic">
                Nu există feedback încă.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.map((f, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2 text-white/40 italic text-xs">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                          <Users size={14} />
                        </div>
                        Student Anonim
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded text-yellow-500 text-xs font-bold border border-yellow-500/20">
                        {f.rating} <Star size={12} className="fill-current" />
                      </div>
                    </div>
                    <p className="text-sm text-white/80 bg-black/20 p-3 rounded-lg border border-white/5 italic">
                      "{f.comment || "Fără comentariu."}"
                    </p>
                    <div className="mt-2 text-[10px] text-white/20 text-right">
                      {new Date(f.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "files" ? (
          <div className="p-6">
            {isLoadingFiles ? (
              <div className="flex justify-center py-12 text-blue-400">
                <Loader className="animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {files
                  .filter((f) => isImage(f.file_path))
                  .map((f) => (
                    <div
                      key={f.id_file}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5 cursor-pointer"
                      onClick={() =>
                        setPreviewImage(filesService.getFileUrl(f.file_path))
                      }
                    >
                      <img
                        src={filesService.getFileUrl(f.file_path)}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        alt="Material"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                        <Eye className="text-white" size={28} />
                        <span className="text-white text-[10px] font-bold">
                          PREVIZUALIZARE
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1a1040]/50 text-xs text-white/50 uppercase border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Participant</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Acțiune</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredParticipants.map((p) => (
                  <tr
                    key={p.id_registration}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa]/20 to-[#7c3aed]/20 border border-white/10 flex items-center justify-center text-sm font-bold text-[#c4b5fd]">
                        {p.users.first_name[0]}
                        {p.users.last_name[0]}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {p.users.first_name} {p.users.last_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {p.users.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${
                          p.checked_in
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : "bg-orange-500/10 text-orange-400/70 border-orange-500/20"
                        }`}
                      >
                        {p.checked_in ? "CONFIRMAT" : "ÎN AȘTEPTARE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!p.checked_in && (
                        <button
                          onClick={() =>
                            handleManualCheckIn(p.id_registration, p.qr_token)
                          }
                          className="text-xs font-bold bg-[#c4b5fd]/20 text-[#c4b5fd] px-4 py-2 rounded-lg border border-[#a78bfa]/30 hover:bg-[#a78bfa]/30 transition-all"
                        >
                          Check In
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />

      {previewImage &&
        createPortal(
          <div
            className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setPreviewImage(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all z-20"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(null);
              }}
              title="Închide"
            >
              <X size={24} />
            </button>

            <div
              className="relative w-full max-w-6xl h-[85vh] md:h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {previewImage.toLowerCase().includes(".pdf") ? (
                <iframe
                  src={previewImage}
                  title="PDF Preview"
                  className="w-full h-full rounded-xl shadow-2xl bg-white"
                />
              ) : (
                <img
                  src={previewImage}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  alt="Preview"
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default EventParticipantsPage;
