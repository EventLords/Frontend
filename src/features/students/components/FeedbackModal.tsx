import React, { useState } from "react";
import { X, Star, Send } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  eventTitle: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  eventTitle,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // Pentru efect vizual la hover
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Te rog selectează un rating!");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      onClose();
      setRating(0);
      setComment("");
    } catch (error) {
      console.error(error);
      alert("A apărut o eroare la trimiterea feedback-ului.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#151632] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-[#1E1E40]">
          <h3 className="text-xl font-bold text-white">Feedback Eveniment</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-slate-400 text-sm mb-4">
            Cum a fost experiența ta la{" "}
            <span className="text-white font-semibold">{eventTitle}</span>?
          </p>

          {/* Stars Selection */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  className={`
                    ${
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-600"
                    }
                    transition-colors duration-200
                  `}
                />
              </button>
            ))}
          </div>

          <p className="text-center text-yellow-400 font-medium mb-4 h-6">
            {rating > 0
              ? rating === 5
                ? "Excelent!"
                : rating === 4
                ? "Foarte bun"
                : rating === 3
                ? "Bunicel"
                : rating === 2
                ? "Slăbuț"
                : "Dezamăgitor"
              : "Selectează o notă"}
          </p>

          {/* Comment */}
          <textarea
            className="w-full bg-[#0F1023] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none"
            rows={4}
            placeholder="Scrie câteva gânduri (opțional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {/* Footer Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-all font-medium"
            >
              Anulează
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {isSubmitting ? (
                "Se trimite..."
              ) : (
                <>
                  Trimite <Send size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
