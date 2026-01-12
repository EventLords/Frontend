import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StudentRegisterForm } from '../../features/auth/components/StudentRegisterForm';
import { OrganizerRegisterForm } from '../../features/auth/components/OrganizerRegisterForm';
import { StudentRegisterFormData, OrganizerRegisterFormData } from '../../types/auth';
import authService from '../../services/authService';
import './RegisterPage.css';
import AnimatedBackground from '../../components/AnimatedBackground';
import { CheckCircle, Mail } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'organizator'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<'student' | 'organizer' | null>(null);

  // Student form state
  const [studentFormData, setStudentFormData] = useState<StudentRegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    facultyId: '',
    specializationId: '',
    studyCycle: '',
    studyYear: '',
  });
  const [studentErrors, setStudentErrors] = useState<Partial<Record<keyof StudentRegisterFormData, string>>>({});

  // Organizer form state
  const [organizerFormData, setOrganizerFormData] = useState<OrganizerRegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    organizationName: '',
    organizationType: '',
    organizationDescription: '',
  });
  const [organizerErrors, setOrganizerErrors] = useState<Partial<Record<keyof OrganizerRegisterFormData, string>>>({});

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudentFormData(prev => ({ ...prev, [name]: value }));
    if (studentErrors[name as keyof StudentRegisterFormData]) {
      setStudentErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handleOrganizerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrganizerFormData(prev => ({ ...prev, [name]: value }));
    if (organizerErrors[name as keyof OrganizerRegisterFormData]) {
      setOrganizerErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const validateStudentForm = (): boolean => {
    const errors: Partial<Record<keyof StudentRegisterFormData, string>> = {};

    if (!studentFormData.firstName.trim()) errors.firstName = 'Prenumele este obligatoriu';
    if (!studentFormData.lastName.trim()) errors.lastName = 'Numele este obligatoriu';
    if (!studentFormData.email.trim()) {
      errors.email = 'Email-ul este obligatoriu';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentFormData.email)) {
      errors.email = 'Email invalid';
    }
    if (!studentFormData.password) {
      errors.password = 'Parola este obligatorie';
    } else if (studentFormData.password.length < 6) {
      errors.password = 'Parola trebuie să aibă minim 6 caractere';
    }
    if (!studentFormData.facultyId) errors.facultyId = 'Facultatea este obligatorie';
    if (!studentFormData.specializationId) errors.specializationId = 'Specializarea este obligatorie';
    if (!studentFormData.studyCycle) errors.studyCycle = 'Ciclul de studii este obligatoriu';
    if (!studentFormData.studyYear) errors.studyYear = 'Anul de studiu este obligatoriu';

    setStudentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOrganizerForm = (): boolean => {
    const errors: Partial<Record<keyof OrganizerRegisterFormData, string>> = {};

    if (!organizerFormData.firstName.trim()) errors.firstName = 'Prenumele este obligatoriu';
    if (!organizerFormData.lastName.trim()) errors.lastName = 'Numele este obligatoriu';
    if (!organizerFormData.email.trim()) {
      errors.email = 'Email-ul este obligatoriu';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizerFormData.email)) {
      errors.email = 'Email invalid';
    }
    if (!organizerFormData.password) {
      errors.password = 'Parola este obligatorie';
    } else if (organizerFormData.password.length < 6) {
      errors.password = 'Parola trebuie să aibă minim 6 caractere';
    }
    if (!organizerFormData.phone.trim()) errors.phone = 'Telefonul este obligatoriu';
    if (!organizerFormData.organizationType) errors.organizationType = 'Tipul organizației este obligatoriu';
    if (!organizerFormData.organizationDescription.trim()) errors.organizationDescription = 'Descrierea este obligatorie';

    setOrganizerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateStudentForm()) return;

    setIsLoading(true);
    try {
      // Convert studyYear to number if provided (I, II, III, IV -> 1, 2, 3, 4)
      const studyYearMap: Record<string, number> = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 };
      const studyYearNum = studentFormData.studyYear ? studyYearMap[studentFormData.studyYear] : undefined;

      await authService.registerStudent({
        firstName: studentFormData.firstName,
        lastName: studentFormData.lastName,
        email: studentFormData.email,
        password: studentFormData.password,
        studyCycle: studentFormData.studyCycle,
        facultyId: parseInt(studentFormData.facultyId, 10),
        specializationId: parseInt(studentFormData.specializationId, 10),
        studyYear: studyYearNum,
      });

      // Show success message
      setRegistrationSuccess('student');
    } catch (error: unknown) {
      console.error('Student registration error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setApiError(axiosError.response?.data?.message || 'A apărut o eroare la înregistrare');
      } else {
        setApiError('A apărut o eroare de conexiune');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrganizerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateOrganizerForm()) return;

    setIsLoading(true);
    try {
      await authService.registerOrganizer({
        firstName: organizerFormData.firstName,
        lastName: organizerFormData.lastName,
        email: organizerFormData.email,
        password: organizerFormData.password,
        phone: organizerFormData.phone,
        organizationType: organizerFormData.organizationType,
        organizationName: organizerFormData.organizationName || undefined,
        organizationDescription: organizerFormData.organizationDescription,
      });

      // Show success message - organizer needs admin approval
      setRegistrationSuccess('organizer');
    } catch (error: unknown) {
      console.error('Organizer registration error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setApiError(axiosError.response?.data?.message || 'A apărut o eroare la înregistrare');
      } else {
        setApiError('A apărut o eroare de conexiune');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success view after registration
  if (registrationSuccess) {
    return (
      <div className="min-h-screen w-full text-white flex items-center justify-center p-4 relative">
        <AnimatedBackground />
        <div className="relative w-full max-w-lg overflow-hidden rounded-[26px] border border-violet-300/70 shadow-[0_0_30px_rgba(168,85,247,0.45)] bg-[#111427] p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">
              {registrationSuccess === 'student' ? 'Cont creat cu succes!' : 'Cerere trimisă!'}
            </h2>
            
            {registrationSuccess === 'student' ? (
              <div className="space-y-4">
                <p className="text-white/70">
                  Contul tău de student a fost creat și activat. Te poți autentifica acum.
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full py-3 rounded-full bg-gradient-to-b from-violet-300 to-violet-700 shadow-[0_0_18px_rgba(168,85,247,0.45)] font-extrabold text-[#0b0f1f] hover:shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all"
                >
                  Autentifică-te
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 text-amber-300 mb-2">
                    <Mail className="w-5 h-5" />
                    <span className="font-semibold">În așteptare</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    Contul tău de organizator a fost creat și așteaptă aprobarea unui administrator.
                  </p>
                </div>
                <p className="text-white/60 text-sm">
                  Vei primi o notificare pe email când contul tău va fi aprobat și vei putea să te autentifici.
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full py-3 rounded-full bg-white/10 border border-white/20 font-semibold text-white hover:bg-white/20 transition-all text-center"
                >
                  Înapoi la autentificare
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="relative w-full max-w-5xl min-h-[620px] overflow-hidden rounded-[26px] border border-violet-300/70 shadow-[0_0_30px_rgba(168,85,247,0.45)] bg-[#111427]">
        {/* Background diagonal - narrower to give more space to form */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[#111427]" />
          <div
            className="absolute inset-0 opacity-95 bg-gradient-to-b from-[#8b5cf6] via-[#4c1d95] to-[#0b0f1f]"
            style={{ clipPath: "polygon(0 0, 45% 0, 25% 100%, 0 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(24.2% 100%, 25% 100%, 45% 0, 44.2% 0)",
              background: "rgba(168,85,247,0.9)",
              filter: "blur(0.2px)",
            }}
          />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-[35%_65%] h-full min-h-[620px]">
          {/* Left text */}
          <div className="hidden md:flex items-center justify-center p-6 pointer-events-none">
            <div className="w-full max-w-[280px]">
              <h2 className="text-3xl font-extrabold leading-tight">Înregistrare</h2>
              <p className="mt-3 text-white/85 text-sm">Alege rolul și completează datele pentru a crea un cont.</p>
            </div>
          </div>

          {/* Right form - more space */}
          <div className="flex items-center justify-center md:justify-end p-4 md:p-6 md:pr-8 overflow-y-auto max-h-[620px]">
            <div className="w-full max-w-[480px]">
              <h1 className="text-2xl font-extrabold text-center mb-4 md:hidden">Înregistrare</h1>

              {/* Tab Switcher */}
              <div className="mb-4">
                <div className="relative w-full rounded-full bg-white/10 p-[3px] border border-white/10 backdrop-blur">
                  <div
                    className={`absolute top-[3px] bottom-[3px] w-1/2 rounded-full bg-gradient-to-b from-violet-300 to-violet-600 shadow-[0_0_14px_rgba(168,85,247,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      activeTab === 'organizator' ? 'translate-x-full' : 'translate-x-0'
                    }`}
                  />
                  <div className="relative grid grid-cols-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('student'); setApiError(null); }}
                      className={`py-2 rounded-full transition-colors ${
                        activeTab === 'student' ? 'text-[#0b0f1f]' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('organizator'); setApiError(null); }}
                      className={`py-2 rounded-full transition-colors ${
                        activeTab === 'organizator' ? 'text-[#0b0f1f]' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Organizator
                    </button>
                  </div>
                </div>
              </div>

              {/* API Error */}
              {apiError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl">
                  <p className="text-red-300 text-sm text-center">{apiError}</p>
                </div>
              )}

              {/* Form Cards */}
              <div className="relative">
                {/* Student Form */}
                <div className={`transition-all duration-300 ${activeTab === 'organizator' ? 'hidden' : ''}`}>
                  <div className="bg-[#0d1117] p-4 md:p-5 rounded-2xl border border-white/10">
                    <form onSubmit={handleStudentSubmit}>
                      <StudentRegisterForm 
                        formData={studentFormData}
                        onChange={handleStudentChange}
                        errors={studentErrors}
                      />
                      <div className="flex flex-col items-center mt-5 gap-3">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-10 rounded-full bg-gradient-to-b from-violet-300 to-violet-700 shadow-[0_0_18px_rgba(168,85,247,0.45)] font-extrabold text-[#0b0f1f] disabled:opacity-60 transition-all hover:shadow-[0_0_24px_rgba(168,85,247,0.6)]"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Se creează...
                            </span>
                          ) : (
                            'Creare cont'
                          )}
                        </button>
                        <p className="text-sm text-white/70">
                          Ai deja cont?{' '}
                          <Link
                            to="/login"
                            className="text-violet-300 font-bold hover:underline"
                          >
                            Autentifică-te
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Organizer Form */}
                <div className={`transition-all duration-300 ${activeTab === 'student' ? 'hidden' : ''}`}>
                  <div className="bg-[#0d1117] p-4 md:p-5 rounded-2xl border border-white/10">
                    <form onSubmit={handleOrganizerSubmit}>
                      <OrganizerRegisterForm 
                        formData={organizerFormData}
                        onChange={handleOrganizerChange}
                        errors={organizerErrors}
                      />
                      <div className="flex flex-col items-center mt-5 gap-3">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-10 rounded-full bg-gradient-to-b from-violet-300 to-violet-700 shadow-[0_0_18px_rgba(168,85,247,0.45)] font-extrabold text-[#0b0f1f] disabled:opacity-60 transition-all hover:shadow-[0_0_24px_rgba(168,85,247,0.6)]"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Se creează...
                            </span>
                          ) : (
                            'Creare cont'
                          )}
                        </button>
                        <p className="text-sm text-white/70">
                          Ai deja cont?{' '}
                          <Link
                            to="/login"
                            className="text-violet-300 font-bold hover:underline"
                          >
                            Autentifică-te
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
