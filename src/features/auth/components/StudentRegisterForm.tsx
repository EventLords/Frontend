import React, { useState, useEffect } from 'react';
import InputGroup from '../../../components/ui/InputGroup';
import { User, Mail, Lock, GraduationCap, School, BookOpen, Calendar } from 'lucide-react';
import { StudentRegisterFormData } from '../../../types/auth';

// Types for API responses - matching backend exactly
interface Faculty {
  id_faculty: number;
  name: string;
}

interface Specialization {
  id_specialization: number;
  name: string;
  study_cycle: string;
}

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface StudentRegisterFormProps {
  formData: StudentRegisterFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors?: Partial<Record<keyof StudentRegisterFormData, string>>;
}

export const StudentRegisterForm: React.FC<StudentRegisterFormProps> = ({ formData, onChange, errors }) => {
  // State for faculties and specializations
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(true);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);

  // Fetch faculties on mount
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoadingFaculties(true);
        const response = await fetch(`${API_BASE_URL}/faculties`);
        if (response.ok) {
          const data = await response.json();
          // Backend returns array directly or wrapped in data
          setFaculties(Array.isArray(data) ? data : (data.data || []));
        } else {
          console.error('Failed to fetch faculties');
          setFaculties([]);
        }
      } catch (error) {
        console.error('Error fetching faculties:', error);
        setFaculties([]);
      } finally {
        setLoadingFaculties(false);
      }
    };

    fetchFaculties();
  }, []);

  // Fetch specializations when faculty changes
  useEffect(() => {
    if (!formData.facultyId) {
      setSpecializations([]);
      return;
    }

    const fetchSpecializations = async () => {
      try {
        setLoadingSpecializations(true);
        
        // Correct endpoint: /faculties/:id/specializations
        const response = await fetch(
          `${API_BASE_URL}/faculties/${formData.facultyId}/specializations`
        );
        
        if (response.ok) {
          const data = await response.json();
          // Backend returns array directly or wrapped in data
          setSpecializations(Array.isArray(data) ? data : (data.data || []));
        } else {
          console.error('Failed to fetch specializations');
          setSpecializations([]);
        }
      } catch (error) {
        console.error('Error fetching specializations:', error);
        setSpecializations([]);
      } finally {
        setLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, [formData.facultyId]);

  // Transform faculties for InputGroup - using backend field names
  const facultyOptions = faculties.map(f => ({
    value: f.id_faculty,
    label: f.name,
  }));

  // Transform specializations for InputGroup - using backend field names
  const specializationOptions = specializations.map(s => ({
    value: s.id_specialization,
    label: `${s.name} — ${s.study_cycle}`,
  }));

  // Study cycle options
  const studyCycleOptions = [
    { value: 'licenta', label: 'Licență' },
    { value: 'master', label: 'Master' },
    { value: 'doctorat', label: 'Doctorat' },
  ];

  // Study year options
  const studyYearOptions = [
    { value: 'I', label: 'I' },
    { value: 'II', label: 'II' },
    { value: 'III', label: 'III' },
    { value: 'IV', label: 'IV' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 animate-fade-in">
      {/* Row 1 */}
      <div>
        <InputGroup 
          label="Nume" 
          icon={<User size={14} />} 
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
        />
        {errors?.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
      </div>
      <div>
        <InputGroup 
          label="Prenume" 
          icon={<User size={14} />} 
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
        />
        {errors?.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
      </div>

      {/* Row 2 */}
      <div>
        <InputGroup
          label="Ciclu de studii"
          icon={<GraduationCap size={14} />}
          options={studyCycleOptions}
          name="studyCycle"
          value={formData.studyCycle}
          onChange={onChange}
        />
        {errors?.studyCycle && <p className="text-red-500 text-xs mt-1">{errors.studyCycle}</p>}
      </div>
      <div>
        <InputGroup
          label="Facultate"
          icon={<School size={14} />}
          options={facultyOptions}
          value={formData.facultyId}
          onChange={onChange}
          disabled={loadingFaculties}
          name="facultyId"
        />
        {errors?.facultyId && <p className="text-red-500 text-xs mt-1">{errors.facultyId}</p>}
      </div>

      {/* Row 3 */}
      <div>
        <InputGroup
          label="Specializare"
          icon={<BookOpen size={14} />}
          options={specializationOptions}
          value={formData.specializationId}
          onChange={onChange}
          disabled={!formData.facultyId || loadingSpecializations}
          name="specializationId"
        />
        {errors?.specializationId && <p className="text-red-500 text-xs mt-1">{errors.specializationId}</p>}
      </div>
      <div>
        <InputGroup
          label="An de studiu"
          icon={<Calendar size={14} />}
          options={studyYearOptions}
          name="studyYear"
          value={formData.studyYear}
          onChange={onChange}
        />
        {errors?.studyYear && <p className="text-red-500 text-xs mt-1">{errors.studyYear}</p>}
      </div>

      {/* Row 4 */}
      <div>
        <InputGroup
          label="E-mail"
          type="email"
          icon={<Mail size={14} />}
          name="email"
          value={formData.email}
          onChange={onChange}
        />
        {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <InputGroup
          label="Parolă"
          type="password"
          icon={<Lock size={14} />}
          name="password"
          value={formData.password}
          onChange={onChange}
        />
        {errors?.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
    </div>
  );
};

export default StudentRegisterForm;
