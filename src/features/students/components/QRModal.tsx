import React, { useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  X,
  Download,
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { StudentEvent, Enrollment } from "../../../types/student";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
  event: StudentEvent;
  // userEmail and onSendEmail removed as requested
}

const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  enrollment,
  event,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !enrollment) return null;

  // ✅ Fail-safe: Extract the correct token
  const qrTokenValue = (enrollment as any).qr_token || enrollment.qrCode || "";

  if (!qrTokenValue) {
    console.error("QR Error: Token lipsă.", enrollment);
    return null;
  }

  // ✅ Senior Dev Fix: Robust SVG to PNG Export
  // This ensures the downloaded image has a white background and proper padding
  const handleDownload = async () => {
    if (!qrRef.current) return;

    // We target the SVG inside the QRCode component
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    try {
      // 1. Clone the SVG node to manipulate it without affecting the DOM
      const clonedSvg = svg.cloneNode(true) as SVGElement;

      // Get the bounding box to know the exact dimensions
      const bbox = svg.getBoundingClientRect();
      const width = Math.ceil(bbox.width);
      const height = Math.ceil(bbox.height);

      // Force dimensions on the cloned SVG for consistent scaling
      clonedSvg.setAttribute("width", String(width));
      clonedSvg.setAttribute("height", String(height));

      // Ensure namespace is present (sometimes missing in inline SVGs)
      clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

      // 2. Serialize to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);

      // 3. Create Blob and URL
      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      // 4. Prepare Canvas with High Scaling
      const scale = 4; // High resolution
      const canvas = document.createElement("canvas");
      // Add extra padding to the canvas dimensions (e.g., 40px total padding)
      const padding = 40;
      canvas.width = width * scale + padding;
      canvas.height = height * scale + padding;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }

      // 5. Load Image and Draw
      const img = new Image();
      // 'decoding="sync"' ensures we wait for full decode if supported, but 'onload' handles async anyway.

      img.onload = () => {
        // 🔹 CRITICAL: Fill background with white. Transparent PNGs can be unreadable.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image centered
        const x = (canvas.width - width * scale) / 2;
        const y = (canvas.height - height * scale) / 2;
        ctx.drawImage(img, x, y, width * scale, height * scale);

        // 6. Trigger Download
        const link = document.createElement("a");
        const safeName = event.name.replace(/[^a-z0-9]/gi, "-").toLowerCase();
        link.download = `bilet-${safeName}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        URL.revokeObjectURL(url);

        // UI Feedback
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2000);
      };

      img.onerror = (e) => {
        console.error("Error loading SVG image for export", e);
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (e) {
      console.error("QR Export failed:", e);
      alert("A apărut o eroare la descărcarea biletului.");
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("ro-RO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "Nespecificat";
    return new Date(dateStr).toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Bucharest",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Positioning */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b from-[#12162a] to-[#1a1040] border border-[#a78bfa]/20 text-left shadow-2xl transition-all animate-scale-in sm:my-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/20 rounded-full mb-4 ring-1 ring-green-500/40">
              <CheckCircle size={28} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Înscriere confirmată!
            </h2>
            <p className="text-sm text-white/60">
              Prezintă acest cod la intrare
            </p>
          </div>

          {/* Event Details Card */}
          <div className="mx-6 p-3 bg-[#a78bfa]/10 rounded-xl border border-[#a78bfa]/20 mb-4">
            <h3 className="font-semibold text-white mb-2 text-sm truncate">
              {event.name}
            </h3>
            <div className="space-y-1 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-[#a78bfa]" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-[#a78bfa]" />
                <span>{formatTime(event.time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-[#a78bfa]" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="px-6 py-4 flex flex-col items-center">
            {/* Added extra padding container for cleaner visual & export */}
            <div
              ref={qrRef}
              className="p-4 bg-white rounded-xl shadow-lg border-4 border-white"
              style={{ display: "inline-block" }}
            >
              <QRCode
                value={qrTokenValue}
                size={200} // Increased slightly for better visibility
                level="M" // Medium Error Correction is balanced for scanning
                fgColor="#000000"
                bgColor="#ffffff"
                style={{ display: "block" }} // Removes bottom gap
              />
            </div>
            {/* REMOVED: ID text below QR code as requested */}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 pt-2 space-y-3">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:to-[#c4b5fd] text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 transition-all transform hover:-translate-y-0.5 text-sm"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle size={18} /> Salvat!
                </>
              ) : (
                <>
                  <Download size={18} /> Descarcă Biletul
                </>
              )}
            </button>
            {/* REMOVED: Send to Email button as requested */}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-0">
            <p className="text-[10px] text-center text-white/30 border-t border-white/5 pt-3">
              Poți accesa biletul oricând din secțiunea "Evenimentele mele".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
