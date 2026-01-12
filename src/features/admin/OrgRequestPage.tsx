import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  CheckCircle,
  XCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import adminService from "../../features/admin/services/adminService"; // Verifică calea să fie corectă

// -------------------------------------------------------------------------
// TYPES
// -------------------------------------------------------------------------

interface AccountRequest {
  id: string;
  userName: string;
  userEmail: string;
  accountType: "organizer" | "student";
  requestedFaculty: string;
  reason: string;
  requestDate: Date;
  status: "pending" | "approved" | "rejected";
}

// -------------------------------------------------------------------------
// MAPPER
// -------------------------------------------------------------------------

const mapOrganizerToRequest = (org: any): AccountRequest => ({
  id: String(org.id_user),
  userName: org.organization_name || "Organizator",
  userEmail: org.email,
  accountType: "organizer",
  requestedFaculty: org.organization_type || "-",
  reason: "",
  requestDate: new Date(org.created_at),
  status: "pending",
});

// -------------------------------------------------------------------------
// COMPONENT
// -------------------------------------------------------------------------

const AccountRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject">(
    "approve"
  );
  const [selectedRequest, setSelectedRequest] = useState<AccountRequest | null>(
    null
  );
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchPendingOrganizers = async () => {
      try {
        setIsLoading(true);
        const organizers = await adminService.getPendingOrganizers();
        setRequests(organizers.map(mapOrganizerToRequest));
      } catch (err) {
        console.error("Eroare la încărcarea cererilor:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingOrganizers();
  }, []);

  // Handlers
  const openActionModal = (
    req: AccountRequest,
    action: "approve" | "reject"
  ) => {
    setSelectedRequest(req);
    setModalAction(action);
    setRejectReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest) return;

    try {
      setIsProcessing(true);

      if (modalAction === "approve") {
        await adminService.approveOrganizer(Number(selectedRequest.id));
      } else {
        await adminService.rejectOrganizer(
          Number(selectedRequest.id),
          rejectReason
        );
      }

      // Scoatem din listă după succes
      setRequests((prev) =>
        prev.filter((req) => req.id !== selectedRequest.id)
      );
      closeModal();
    } catch (err) {
      console.error("Eroare la procesarea cererii:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="text-white animate-fade-in p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Cereri Conturi
          </h1>
          <p className="text-white/60">
            Aprobă sau respinge cererile pentru conturi noi.
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

      {isLoading ? (
        <div className="py-20 text-center text-white/60 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin"></div>
          Se încarcă cererile...
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-[#1a1040]/60 rounded-xl p-12 text-center border border-[#a78bfa]/20">
          <User size={48} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/60">
            Nu există cereri de cont în așteptare.
          </p>
        </div>
      ) : (
        <div className="bg-[#1a1040]/60 rounded-xl border border-[#a78bfa]/20 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">
              Lista de așteptare{" "}
              <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-[#a78bfa]/20 text-[#a78bfa]">
                {requests.length}
              </span>
            </h2>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-xs uppercase text-white/40 font-medium">
              <tr>
                <th className="px-6 py-4">Utilizator</th>
                <th className="px-6 py-4">Facultate / Organizație</th>
                <th className="px-6 py-4">Data Cererii</th>
                <th className="px-6 py-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#a78bfa]/20 flex items-center justify-center text-[#a78bfa]">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{req.userName}</p>
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <Mail size={10} />
                          {req.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {req.requestedFaculty}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {format(req.requestDate, "dd MMM yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openActionModal(req, "approve")}
                        className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors tooltip"
                        title="Aprobă"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => openActionModal(req, "reject")}
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
      )}

      {/* --- STYLIZED MODAL --- */}
      {modalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-[#0a051e]/80 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-[#130d30] border border-[#a78bfa]/30 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(167,139,250,0.15)] overflow-hidden animate-scale-in">
            {/* Modal Header */}
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
                      ? "Aprobare Cont"
                      : "Respingere Cont"}
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

            {/* Modal Body */}
            <div className="p-6">
              {modalAction === "approve" ? (
                <p className="text-white/80 text-lg">
                  Ești sigur că vrei să aprobi contul pentru <br />
                  <strong className="text-white">
                    {selectedRequest.userName}
                  </strong>
                  ?
                </p>
              ) : (
                <>
                  <p className="text-white/80 mb-4">
                    Specifică motivul pentru care respingi contul{" "}
                    <strong>{selectedRequest.userName}</strong>:
                  </p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-[#0a051e] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-rose-500/50 transition-colors resize-none h-32"
                    placeholder="Ex: Datele furnizate nu sunt valide..."
                  />
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-2 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium"
              >
                Anulează
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className={`flex-1 py-2.5 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          modalAction === "approve"
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-emerald-500/25 text-white"
                            : "bg-gradient-to-r from-rose-500 to-rose-600 hover:shadow-rose-500/25 text-white"
                        }
                    `}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Procesare...
                  </span>
                ) : modalAction === "approve" ? (
                  "Confirmă Aprobarea"
                ) : (
                  "Confirmă Respingerea"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountRequestsPage;
