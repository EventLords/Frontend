import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { X, Download, Mail, CheckCircle, Loader, Calendar, MapPin, Clock } from 'lucide-react';
import { StudentEvent, Enrollment } from '../../../types/student';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
  event: StudentEvent;
  userEmail?: string;
  onSendEmail?: (email: string) => Promise<boolean>;
}

const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  enrollment,
  event,
  userEmail = 'student@usv.ro',
  onSendEmail
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !enrollment) return null;

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const svgRect = svg.getBoundingClientRect();
    const scale = 3; // Higher resolution
    canvas.width = svgRect.width * scale;
    canvas.height = svgRect.height * scale;

    // Create image from SVG
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Fill white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Download
      const link = document.createElement('a');
      link.download = `bilet-${event.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    };
    img.src = url;
  };

  const handleSendEmail = async () => {
    if (!onSendEmail) return;
    
    setIsSending(true);
    try {
      const success = await onSendEmail(userEmail);
      if (success) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a1a4e] to-[#2d2d6e] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Înscrierea ta a fost confirmată!
          </h2>
          <p className="text-sm text-white/60">
            Prezintă acest QR code la intrarea în eveniment
          </p>
        </div>

        {/* Event Info */}
        <div className="mx-6 p-4 bg-[#4ECDC4]/10 rounded-xl border border-[#4ECDC4]/30 mb-4">
          <h3 className="font-semibold text-white mb-2">{event.name}</h3>
          <div className="space-y-1 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#4ECDC4]" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#4ECDC4]" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#4ECDC4]" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="px-6 py-4">
          <div 
            ref={qrRef}
            className="mx-auto w-fit p-4 bg-white rounded-xl"
          >
            <QRCode
              value={enrollment.qrCode}
              size={180}
              level="H"
              fgColor="#1a1a4e"
            />
          </div>
          <p className="text-center text-xs text-white/40 mt-3">
            ID: {enrollment.qrCode.slice(0, 20)}...
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4ECDC4] text-white font-semibold rounded-xl hover:bg-[#3dbdb5] transition-colors"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle size={18} />
                Descărcat!
              </>
            ) : (
              <>
                <Download size={18} />
                Descarcă biletul
              </>
            )}
          </button>

          {/* Send Email Button */}
          <button
            onClick={handleSendEmail}
            disabled={isSending || emailSent}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader size={18} className="animate-spin" />
                Se trimite...
              </>
            ) : emailSent ? (
              <>
                <CheckCircle size={18} className="text-green-400" />
                Trimis la {userEmail}
              </>
            ) : (
              <>
                <Mail size={18} />
                Trimite pe email
              </>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <div className="px-6 pb-6">
          <p className="text-xs text-center text-white/40">
            Biletul a fost salvat automat în contul tău. 
            Îl poți accesa oricând din secțiunea "Evenimentele mele".
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
