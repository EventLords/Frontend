import React from "react";
import { Archive, Loader2 } from "lucide-react";

interface ArchiveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventName: string;
  isArchiving: boolean;
}

const ArchiveConfirmationModal: React.FC<ArchiveConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  eventName,
  isArchiving,
}) => {
  if (!isOpen) return null;

  return (
    // Overlay (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Modal Content */}
      <div
        className="bg-[#1E1E40] border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon Circle (Portocaliu/Galben pentru Arhivare) */}
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 border border-orange-500/20">
            <Archive className="text-orange-500" size={32} />
          </div>

          {/* Titlu */}
          <h3 className="text-xl font-bold text-white mb-2">
            Finalizează evenimentul
          </h3>

          {/* Mesaj explicativ */}
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Ești sigur că vrei să marchezi evenimentul{" "}
            <span className="text-white font-semibold">{eventName}</span> ca
            fiind finalizat?
            <br />
            Acesta va deveni{" "}
            <span className="text-orange-400 font-medium">inactiv</span> și nu
            va mai putea primi înscrieri noi.
          </p>

          {/* Butoane */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isArchiving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#2D2D55] text-white font-medium hover:bg-[#3D3D6B] transition-colors disabled:opacity-50"
            >
              Anulează
            </button>

            <button
              onClick={onConfirm}
              disabled={isArchiving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isArchiving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Se finalizează...
                </>
              ) : (
                <>
                  <Archive size={18} /> Finalizează
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveConfirmationModal;
