<<<<<<< HEAD
import React from 'react';
import InputGroup from '../../../components/ui/InputGroup';
import { User, Phone, Mail, Lock, Building2, FileText } from 'lucide-react';

export const OrganizerRegisterForm: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 animate-fade-in">
      {/* Row 1 */}
      <InputGroup 
        label="Nume responsabil" 
        icon={<User size={14} />}
      />
      <InputGroup 
        label="Prenume responsabil" 
        icon={<User size={14} />}
      />

      {/* Row 2 */}
      <InputGroup 
        label="E-mail" 
        type="email" 
        icon={<Mail size={14} />}
      />
      <InputGroup 
        label="Parolă" 
        type="password" 
        icon={<Lock size={14} />}
      />

      {/* Row 3 */}
      <InputGroup 
        label="Număr de telefon" 
        type="tel" 
        icon={<Phone size={14} />}
      />
      <InputGroup 
        label="Numele organizației (opțional)" 
        icon={<Building2 size={14} />}
      />

      {/* Row 4 */}
      <InputGroup
        label="Tip organizație"
        icon={<Building2 size={14} />}
        options={['ONG', 'Companie', 'Asociație Studențească', 'Facultate']}
      />
      <InputGroup
        label="Descriere și motivul solicitării"
        icon={<FileText size={14} />}
      />
    </div>
  );
};

export default OrganizerRegisterForm;
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Building2 } from "lucide-react";

type Props = {
  formId?: string;
  hideSubmit?: boolean;
  onBusyChange?: (busy: boolean) => void;
};

export function OrganizerRegisterForm({
  formId = "org-register",
  hideSubmit = false,
  onBusyChange,
}: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      organization: String(fd.get("organization") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      confirmPassword: String(fd.get("confirmPassword") || ""),
      role: "organizator" as const,
    };

    if (!payload.organization || !payload.email || !payload.password || !payload.confirmPassword) {
      setError("Completează toate câmpurile.");
      return;
    }
    if (payload.password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere.");
      return;
    }
    if (payload.password !== payload.confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    setLoading(true);
    onBusyChange?.(true);

    await new Promise((r) => setTimeout(r, 700)); // MOCK API
    console.log("REGISTER organizator:", payload);

    setLoading(false);
    onBusyChange?.(false);

    navigate("/autentificare");
  }

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm mb-1 text-white/80">Organizație</label>
        <div className="relative">
          <input
            name="organization"
            className="w-full bg-transparent border-b-2 border-white/60 focus:border-violet-300 outline-none py-2 pr-10 text-white font-semibold placeholder:text-white/30"
            placeholder="Numele organizației"
          />
          <Building2 className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-white/80">Email</label>
        <div className="relative">
          <input
            name="email"
            type="email"
            className="w-full bg-transparent border-b-2 border-white/60 focus:border-violet-300 outline-none py-2 pr-10 text-white font-semibold placeholder:text-white/30"
            placeholder="organizator@email.com"
          />
          <Mail className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-white/80">Parolă</label>
        <div className="relative">
          <input
            name="password"
            type="password"
            className="w-full bg-transparent border-b-2 border-white/60 focus:border-violet-300 outline-none py-2 pr-10 text-white font-semibold placeholder:text-white/30"
            placeholder="••••••••"
          />
          <Lock className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-white/80">Confirmă parola</label>
        <div className="relative">
          <input
            name="confirmPassword"
            type="password"
            className="w-full bg-transparent border-b-2 border-white/60 focus:border-violet-300 outline-none py-2 pr-10 text-white font-semibold placeholder:text-white/30"
            placeholder="••••••••"
          />
          <Lock className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!hideSubmit && (
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-full bg-gradient-to-b from-violet-300 to-violet-700 font-extrabold text-[#0b0f1f] disabled:opacity-60"
        >
          {loading ? "Se creează..." : "Creează cont (Organizator)"}
        </button>
      )}
    </form>
  );
}
>>>>>>> 202a381 (Local frontend state before syncing with remote)
