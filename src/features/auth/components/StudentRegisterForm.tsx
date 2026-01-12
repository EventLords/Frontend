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
