import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import {
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  ScanLine,
} from "lucide-react";

// Detectează dacă contextul este securizat (HTTPS sau localhost)
const isSecureContext = (): boolean => {
  if (typeof window === "undefined") return false;
  // window.isSecureContext este true pe HTTPS sau localhost
  if (window.isSecureContext) return true;
  // Fallback pentru browsere vechi
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return protocol === "https:" || hostname === "localhost" || hostname === "127.0.0.1";
};

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (token: string) => Promise<void>;
}

// --- FUNCȚII UTILITARE (Păstrate intacte) ---
function extractQrToken(input: string): string | null {
  const s = (input || "").trim();
  if (!s) return null;
  // Regex pentru UUID
  const uuidRegex =
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;
  const m = s.match(uuidRegex);
  if (m?.[0]) return m[0].trim();
  return s.length >= 8 ? s : null;
}

function normalizeDetectedValue(first: any): string | null {
  if (!first) return null;
  if (typeof first === "string") return first;
  return (
    first.rawValue ??
    first.raw ??
    first.value ??
    first.data ??
    first.text ??
    null
  );
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [manualCode, setManualCode] = useState("");

  // Gestionare deschidere/închidere și blocare scroll
  useEffect(() => {
    if (isOpen) {
      setScanResult(null);
      setIsProcessing(false);
      setCameraError(null);
      setIsPaused(false);
      // Blocăm scroll-ul pe body cât timp e deschis scanner-ul
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes?.length) return;
    if (isProcessing || scanResult || isPaused) return;

    const raw = normalizeDetectedValue(detectedCodes[0] as any);
    if (!raw) return;

    const token = extractQrToken(raw);
    if (!token) return;

    const cleaned = token.trim();
    setIsProcessing(true);
    setIsPaused(true);

    try {
      await onScan(cleaned);

      setScanResult({
        success: true,
        message: "Check-in realizat cu succes!",
      });

      // Feedback sonor subtil (opțional)
      // const audio = new Audio('/sounds/success.mp3');
      // audio.play().catch(() => {});

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("[QR] Scan check-in error:", error);
      setScanResult({
        success: false,
        message: error?.message || "Cod invalid sau neînregistrat.",
      });

      // Repornim scanner-ul după eroare
      setTimeout(() => {
        setScanResult(null);
        setIsProcessing(false);
        setIsPaused(false);
      }, 2500);
    }
  };

  const handleError = (error: any) => {
    console.error("[QR] Camera error:", error);
    
    // Detectăm dacă problema este contextul HTTP (nu HTTPS)
    if (!isSecureContext()) {
      setCameraError("HTTPS_REQUIRED");
    } else if (error?.name === "NotAllowedError") {
      setCameraError("PERMISSION_DENIED");
    } else {
      setCameraError("GENERIC_ERROR");
    }
  };

  // Handler pentru introducere manuală cod QR
  const handleManualSubmit = async () => {
    const token = extractQrToken(manualCode);
    if (!token) return;

    setIsProcessing(true);
    try {
      await onScan(token.trim());
      setScanResult({
        success: true,
        message: "Check-in realizat cu succes!",
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      setScanResult({
        success: false,
        message: error?.message || "Cod invalid sau neînregistrat.",
      });
      setTimeout(() => {
        setScanResult(null);
        setIsProcessing(false);
      }, 2500);
    }
  };

  return createPortal(
    // ✅ FIX: createPortal + z-[99999] - modal renderizat la document.body, acoperă TOT ecranul
    <div className="fixed inset-0 w-screen h-screen z-[99999] flex flex-col items-center justify-center bg-black animate-in fade-in duration-300">
      {/* --- HEADER SCANNER --- */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Camera className="text-[#a78bfa]" /> Scanare Bilet
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Poziționează codul în chenar
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-md hover:scale-105 active:scale-95"
        >
          <X size={24} />
        </button>
      </div>

      {/* --- ZONA PRINCIPALĂ (VIEWFINDER) --- */}
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
        {/* Container Mare pentru Cameră - Responsive Fullscreen */}
        <div className="relative w-full max-w-3xl h-[70vh] max-h-[600px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
          {cameraError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#1a1025] overflow-y-auto">
              {scanResult ? (
                <div className="flex flex-col items-center">
                  {scanResult.success ? (
                    <CheckCircle size={64} className="text-green-500 mb-4" />
                  ) : (
                    <AlertCircle size={64} className="text-red-500 mb-4" />
                  )}
                  <p className={`text-xl font-bold ${scanResult.success ? "text-green-400" : "text-red-400"}`}>
                    {scanResult.message}
                  </p>
                </div>
              ) : isProcessing ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-[#a78bfa] animate-spin" />
                  <p className="text-white font-bold text-lg mt-4">Verificare...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#a78bfa]/20 rounded-full flex items-center justify-center mb-4 border border-[#a78bfa]/30">
                    <Camera size={32} className="text-[#a78bfa]" />
                  </div>
                  <p className="text-white font-bold text-lg mb-2">
                    Introdu Codul Manual
                  </p>
                  <p className="text-white/50 text-sm max-w-xs mb-6">
                    Camera nu este disponibilă. Introdu codul QR manual pentru check-in.
                  </p>
                  
                  {/* Manual Input Form */}
                  <div className="w-full max-w-sm space-y-4">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="Introdu codul din bilet..."
                      className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/20 transition-all text-center font-mono"
                      onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                    />
                    <button
                      onClick={handleManualSubmit}
                      disabled={!manualCode.trim()}
                      className="w-full py-3 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Verifică Bilet
                    </button>
                  </div>
                  
                  <p className="text-white/30 text-xs mt-6 max-w-xs">
                    Codul se găsește pe biletul participantului (format UUID)
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* COMPONENTA SCANNER */}
              {!scanResult && (
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  paused={isPaused}
                  components={{ torch: true }}
                  constraints={{ facingMode: { ideal: "environment" } }}
                  styles={{
                    container: { width: "100%", height: "100%" },
                    video: { objectFit: "cover" },
                  }}
                />
              )}

              {/* OVERLAY VIZUAL (Ghidaj) */}
              {!isProcessing && !scanResult && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Pătratul de încadrare */}
                  <div className="w-64 h-64 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#a78bfa] rounded-tl-xl drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#a78bfa] rounded-tr-xl drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#a78bfa] rounded-bl-xl drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#a78bfa] rounded-br-xl drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]"></div>

                    {/* Laser animat */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[#a78bfa] shadow-[0_0_20px_#a78bfa] animate-scan-laser opacity-80"></div>

                    {/* Iconiță centrală */}
                    <ScanLine
                      size={48}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10"
                    />
                  </div>
                </div>
              )}

              {/* STARE PROCESARE (Loading) */}
              {isProcessing && !scanResult && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-10 animate-in fade-in">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#a78bfa] blur-2xl opacity-20 rounded-full animate-pulse"></div>
                    <Loader2 className="w-16 h-16 text-[#a78bfa] animate-spin relative z-10" />
                  </div>
                  <p className="text-white font-bold text-lg mt-6 tracking-wider uppercase">
                    Verificare...
                  </p>
                </div>
              )}

              {/* STARE REZULTAT (Succes / Eroare) */}
              {scanResult && (
                <div className="absolute inset-0 bg-[#0f172a] flex flex-col items-center justify-center p-8 z-20 animate-in zoom-in-95 duration-300">
                  {scanResult.success ? (
                    <div className="flex flex-col items-center animate-bounce-subtle">
                      <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(74,222,128,0.5)] border border-green-500/30">
                        <CheckCircle size={48} strokeWidth={3} />
                      </div>
                      <h4 className="text-3xl font-extrabold text-white mb-2">
                        Check-in OK!
                      </h4>
                      <p className="text-green-400/80 text-center font-medium">
                        {scanResult.message}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center animate-shake">
                      <div className="w-24 h-24 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(248,113,113,0.5)] border border-red-500/30">
                        <AlertCircle size={48} strokeWidth={3} />
                      </div>
                      <h4 className="text-3xl font-extrabold text-white mb-2">
                        Eroare
                      </h4>
                      <p className="text-red-400/80 text-center font-medium px-4">
                        {scanResult.message}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Status Text (Sub cameră) */}
        {!scanResult && !cameraError && (
          <div className="mt-8 flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <span className="text-white/60 text-sm font-medium">
              Scanner Activ
            </span>
          </div>
        )}
      </div>

      {/* Animații CSS */}
      <style>{`
        @keyframes scan-laser {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-laser {
          animation: scan-laser 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default QRScannerModal;
