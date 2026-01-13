<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import InputGroup from '../../../components/ui/InputGroup';
import { User, Mail, Lock, GraduationCap, School, BookOpen, Calendar } from 'lucide-react';

// Types for API responses
interface Faculty {
  id: number;
  name: string;
}

interface Specialization {
  id: number;
  name: string;
  cycle: string; // licență, master, doctorat
  faculty_id: number;
}

// API base URL - adjust as needed
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const StudentRegisterForm: React.FC = () => {
  // State for faculties and specializations
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(true);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);

  // Form state
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');

  // Fetch faculties on mount
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoadingFaculties(true);
        const response = await fetch(`${API_BASE_URL}/faculties`);
        if (response.ok) {
          const data = await response.json();
          setFaculties(data);
        } else {
          // Fallback data if API fails
          setFaculties([
            { id: 1, name: 'FIESC' },
            { id: 2, name: 'Litere și Științe ale Comunicării' },
            { id: 3, name: 'Inginerie Mecanică' },
            { id: 4, name: 'Economie și Administrație Publică' },
            { id: 5, name: 'Drept și Științe Administrative' },
            { id: 6, name: 'Silvicultură' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching faculties:', error);
        // Fallback data
        setFaculties([
          { id: 1, name: 'FIESC' },
          { id: 2, name: 'Litere și Științe ale Comunicării' },
          { id: 3, name: 'Inginerie Mecanică' },
          { id: 4, name: 'Economie și Administrație Publică' },
          { id: 5, name: 'Drept și Științe Administrative' },
          { id: 6, name: 'Silvicultură' },
        ]);
      } finally {
        setLoadingFaculties(false);
      }
    };

    fetchFaculties();
  }, []);

  // Fetch specializations when faculty changes
  useEffect(() => {
    if (!selectedFaculty) {
      setSpecializations([]);
      setSelectedSpecialization('');
      return;
    }

    const fetchSpecializations = async () => {
      try {
        setLoadingSpecializations(true);
        setSelectedSpecialization('');
        
        const response = await fetch(
          `${API_BASE_URL}/specializations?faculty_id=${selectedFaculty}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSpecializations(data);
        } else {
          // Fallback data based on faculty
          const fallbackData: Record<string, Specialization[]> = {
            '1': [
              { id: 1, name: 'Calculatoare', cycle: 'licență', faculty_id: 1 },
              { id: 2, name: 'Automatică și Informatică Aplicată', cycle: 'licență', faculty_id: 1 },
              { id: 3, name: 'Electronică Aplicată', cycle: 'licență', faculty_id: 1 },
              { id: 4, name: 'Ingineria Sistemelor Multimedia', cycle: 'master', faculty_id: 1 },
            ],
            '2': [
              { id: 5, name: 'Limba și literatura română', cycle: 'licență', faculty_id: 2 },
              { id: 6, name: 'Comunicare și Relații Publice', cycle: 'licență', faculty_id: 2 },
            ],
          };
          setSpecializations(fallbackData[selectedFaculty] || []);
        }
      } catch (error) {
        console.error('Error fetching specializations:', error);
        setSpecializations([]);
      } finally {
        setLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, [selectedFaculty]);

  // Transform faculties for InputGroup
  const facultyOptions = faculties.map(f => ({
    value: f.id,
    label: f.name,
  }));

  // Transform specializations for InputGroup (name — cycle format)
  const specializationOptions = specializations.map(s => ({
    value: s.id,
    label: `${s.name} — ${s.cycle}`,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 animate-fade-in">
      {/* Row 1 */}
      <InputGroup 
        label="Nume" 
        icon={<User size={14} />} 
        name="lastName"
      />
      <InputGroup 
        label="Prenume" 
        icon={<User size={14} />} 
        name="firstName"
      />

      {/* Row 2 */}
      <InputGroup
        label="Ciclu de studii"
        icon={<GraduationCap size={14} />}
        options={['Licență', 'Master', 'Doctorat']}
        name="studyCycle"
      />
      <InputGroup
        label="Facultate"
        icon={<School size={14} />}
        options={facultyOptions}
        value={selectedFaculty}
        onChange={(e) => setSelectedFaculty(e.target.value)}
        disabled={loadingFaculties}
        name="faculty"
      />

      {/* Row 3 */}
      <InputGroup
        label="Specializare"
        icon={<BookOpen size={14} />}
        options={specializationOptions}
        value={selectedSpecialization}
        onChange={(e) => setSelectedSpecialization(e.target.value)}
        disabled={!selectedFaculty || loadingSpecializations}
        name="specialization"
      />
      <InputGroup
        label="An de studiu"
        icon={<Calendar size={14} />}
        options={['I', 'II', 'III', 'IV']}
        name="studyYear"
      />

      {/* Row 4 */}
      <InputGroup
        label="E-mail"
        type="email"
        icon={<Mail size={14} />}
        name="email"
      />
      <InputGroup
        label="Parolă"
        type="password"
        icon={<Lock size={14} />}
        name="password"
      />
    </div>
  );
};

export default StudentRegisterForm;
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

type Props = {
  formId?: string;
  hideSubmit?: boolean;
  onBusyChange?: (busy: boolean) => void;
};

export function StudentRegisterForm({
  formId = "student-register",
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
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      confirmPassword: String(fd.get("confirmPassword") || ""),
      role: "student" as const,
    };

    if (!payload.name || !payload.email || !payload.password || !payload.confirmPassword) {
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
    console.log("REGISTER student:", payload);

    setLoading(false);
    onBusyChange?.(false);

    navigate("/autentificare");
  }

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm mb-1 text-white/80">Nume</label>
        <div className="relative">
          <input
            name="name"
            className="w-full bg-transparent border-b-2 border-white/60 focus:border-violet-300 outline-none py-2 pr-10 text-white font-semibold placeholder:text-white/30"
            placeholder="Nume Prenume"
          />
          <User className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-white/80">Email</label>
        <div className="relative">
          <input
            name="email"
            type="email"
            className="w-full bg-transparent border-b-2 border-white/60 focus:border-violet-300 outline-none py-2 pr-10 text-white font-semibold placeholder:text-white/30"
            placeholder="nume@email.com"
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

      {/* opțional, dacă vrei să-l lași și în form */}
      {!hideSubmit && (
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-full bg-gradient-to-b from-violet-300 to-violet-700 font-extrabold text-[#0b0f1f] disabled:opacity-60"
        >
          {loading ? "Se creează..." : "Creează cont (Student)"}
        </button>
      )}
    </form>
  );
}
>>>>>>> 202a381 (Local frontend state before syncing with remote)
