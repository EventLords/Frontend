// src/features/admin/EventApprovalPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import adminService from "../../features/admin/services/adminService";

// -------------------------------------------------------------------------
// TYPES
// -------------------------------------------------------------------------

interface EventApproval {
  id: string;
  title: string;
  organizerName: string;
  submissionDate: Date;
  eventType: "new" | "update";
  status: "pending" | "approved" | "rejected";
}

// -------------------------------------------------------------------------
// COMPONENT
// -------------------------------------------------------------------------

const EventApprovalPage: React.FC = () => {
  const navigate = useNavigate();

  // Data State
  const [events, setEvents] = useState<EventApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject">(
    "approve"
  );
  const [selectedEvent, setSelectedEvent] = useState<EventApproval | null>(
    null
  );
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Fetch Data
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getPendingEvents();

      const mappedEvents: EventApproval[] = data.map((e: any) => ({
        id: e.id_event.toString(),
        title: e.title || e.name || "Fără titlu",
        organizerName: (() => {
          if (e.users?.organization_name) return e.users.organization_name;
          if (e.users?.first_name && e.users?.last_name) {
            return `${e.users.first_name} ${e.users.last_name}`;
          }
          if (e.users?.first_name) return e.users.first_name;
          if (e.users?.email) return e.users.email;
          return `Organizator #${e.organizer_id}`;
        })(),
        submissionDate: new Date(e.created_at),
        eventType: "new",
        status: e.status,
      }));

      setEvents(mappedEvents);
    } catch (err: any) {
      console.error("Eroare la preluare evenimente:", err);
      setError("Nu s-au putut încărca evenimentele.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 2. Open Modal Handler
  const openModal = (event: EventApproval, action: "approve" | "reject") => {
    setSelectedEvent(event);
    setModalAction(action);
    setRejectReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // 3. Submit Action Handler
  const handleConfirmAction = async () => {
    if (!selectedEvent) return;

    if (modalAction === "reject" && !rejectReason.trim()) {
      return;
    }

    setActionLoading(true);
    try {
      if (modalAction === "approve") {
        await adminService.approveEvent(Number(selectedEvent.id));
      } else {
        await adminService.rejectEvent(Number(selectedEvent.id), rejectReason);
      }

      // Remove event from list on success
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      closeModal();
    } catch (err: any) {
      alert(err.message || "Eroare la procesare");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="text-white relative animate-fade-in p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Aprobare Evenimente
          </h1>
          <p className="text-white/60">
            Revizuiește evenimentele noi sau modificate înainte de publicare.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/requests")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Înapoi
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-500/30">
          <AlertTriangle size={20} /> {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="py-20 text-center text-white/60 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin"></div>
          Se încarcă evenimentele...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-[#1a1040]/60 rounded-xl p-12 text-center border border-[#a78bfa]/20">
          <Calendar size={48} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/60">
            Nu există evenimente care necesită aprobare momentan.
          </p>
        </div>
      ) : (
        <div className="bg-[#1a1040]/60 rounded-xl border border-[#a78bfa]/20 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">
              Lista de așteptare{" "}
              <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-[#a78bfa]/20 text-[#a78bfa]">
                {events.length}
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-xs uppercase text-white/40 font-medium">
                <tr>
                  <th className="px-6 py-4">Eveniment</th>
                  <th className="px-6 py-4">Organizator</th>
                  <th className="px-6 py-4">Tip Cerere</th>
                  <th className="px-6 py-4">Data Trimitere</th>
                  <th className="px-6 py-4 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {/* LINK CORECTAT AICI */}
                      <Link
                        to={`/admin/events/${event.id}`}
                        className="text-white font-medium hover:text-[#a78bfa] transition-colors block"
                      >
                        {event.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {event.organizerName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          event.eventType === "new"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {event.eventType === "new" ? "Nou" : "Modificare"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {format(event.submissionDate, "dd MMM yyyy", {
                        locale: ro,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* BUTONUL VEZI DETALII - Link corectat */}
                        <Link
                          to={`/admin/events/${event.id}`}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium transition-all"
                        >
                          Vezi Detalii
                        </Link>

                        <button
                          onClick={() => openModal(event, "approve")}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors tooltip"
                          title="Aprobă"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => openModal(event, "reject")}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors tooltip"
                          title="Respinge"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- STYLIZED MODAL --- */}
      {modalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0a051e]/80 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          <div className="relative bg-[#130d30] border border-[#a78bfa]/30 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(167,139,250,0.15)] overflow-hidden animate-scale-in">
            <div
              className={`p-6 border-b ${
                modalAction === "approve"
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-rose-500/20 bg-rose-500/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      modalAction === "approve"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {modalAction === "approve" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertTriangle size={20} />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {modalAction === "approve"
                      ? "Aprobare Eveniment"
                      : "Respingere Eveniment"}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {modalAction === "approve" ? (
                <p className="text-white/80">
                  Ești sigur că vrei să publici evenimentul{" "}
                  <strong className="text-white">{selectedEvent.title}</strong>?
                  <br />
                  <br />
                  <span className="text-xs text-white/50">
                    Acesta va deveni vizibil imediat pentru toți studenții.
                  </span>
                </p>
              ) : (
                <>
                  <p className="text-white/80 mb-4">
                    Specifică motivul pentru care respingi evenimentul{" "}
                    <strong>{selectedEvent.title}</strong>:
                  </p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-[#0a051e] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-rose-500/50 transition-colors resize-none h-32"
                    placeholder="Ex: Informații incomplete, conținut inadecvat..."
                  />
                </>
              )}
            </div>

            <div className="p-6 pt-2 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium"
              >
                Anulează
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={
                  actionLoading ||
                  (modalAction === "reject" && !rejectReason.trim())
                }
                className={`flex-1 py-2.5 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          modalAction === "approve"
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-emerald-500/25 text-white"
                            : "bg-gradient-to-r from-rose-500 to-rose-600 hover:shadow-rose-500/25 text-white"
                        }
                    `}
              >
                {actionLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Procesare...
                  </span>
                ) : modalAction === "approve" ? (
                  "Publică"
                ) : (
                  "Respinge"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventApprovalPage;
