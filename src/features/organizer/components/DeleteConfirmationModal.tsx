import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventName: string;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  eventName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    // Overlay cu backdrop blur
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        className="bg-[#1E1E40] border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon Circle */}
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <AlertTriangle className="text-red-500" size={32} />
          </div>

          {/* Text Content */}
          <h3 className="text-xl font-bold text-white mb-2">
            Șterge evenimentul
          </h3>

          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Ești sigur că vrei să ștergi evenimentul{" "}
            <span className="text-white font-semibold">"{eventName}"</span>?
            <br />
            Această acțiune nu poate fi anulată.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#2D2D55] text-white font-medium hover:bg-[#3D3D6B] transition-colors disabled:opacity-50"
            >
              Anulează
            </button>

            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Se șterge...
                </>
              ) : (
                "Șterge"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
