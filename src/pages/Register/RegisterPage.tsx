import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { StudentRegisterForm } from '../../features/auth/components/StudentRegisterForm';
import { OrganizerRegisterForm } from '../../features/auth/components/OrganizerRegisterForm';

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'organizator'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register submitted for:', activeTab);
  };

  return (
    <div
      className="h-screen font-sans flex flex-col overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/background.svg')",
        backgroundColor: '#F0F9FF',
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {/* Title + Tab inline */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-xl font-bold text-[#1a1a4e] mb-3">Înregistrare</h1>

          {/* Tab Switcher */}
          <div className="bg-white p-1 rounded-full flex w-56 relative shadow-lg z-10 border border-blue-100">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1a1a4e] rounded-full transition-all duration-500 ease-in-out shadow-sm ${
                activeTab === 'organizator' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
              }`}
            />
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-1.5 text-sm font-bold z-10 rounded-full transition-colors duration-300 ${
                activeTab === 'student' ? 'text-white' : 'text-gray-500'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setActiveTab('organizator')}
              className={`flex-1 py-1.5 text-sm font-bold z-10 rounded-full transition-colors duration-300 ${
                activeTab === 'organizator' ? 'text-white' : 'text-gray-500'
              }`}
            >
              Organizator
            </button>
          </div>
        </div>

        {/* Form Cards - 3D Flip Container */}
        <div className="w-full px-4 max-w-4xl perspective-1000">
          <div 
            className={`relative w-full transition-transform duration-700 transform-style-3d ${
              activeTab === 'organizator' ? 'rotate-y-180' : ''
            }`}
          >
            {/* Student Form - Front */}
            <div className={`w-full backface-hidden ${activeTab === 'organizator' ? 'invisible absolute' : ''}`}>
              <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 w-full">
                <form onSubmit={handleSubmit}>
                  <StudentRegisterForm />
                  <div className="flex flex-col items-center mt-6 gap-2">
                    <button
                      type="submit"
                      className="bg-[#DFF3E4] text-[#1a1a4e] font-semibold py-2.5 px-16 rounded-full hover:bg-[#c5e8ce] shadow-sm hover:shadow-md transition-all text-sm border border-[#b8e0c3]"
                    >
                      Creare cont
                    </button>
                    <p className="text-xs text-gray-500">
                      Ai deja cont?{' '}
                      <Link
                        to="/autentificare"
                        className="text-[#1a1a4e] font-semibold hover:underline"
                      >
                        Autentifică-te
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Organizer Form - Back */}
            <div className={`w-full backface-hidden rotate-y-180 ${activeTab === 'student' ? 'invisible absolute' : ''}`}>
              <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 w-full">
                <form onSubmit={handleSubmit}>
                  <OrganizerRegisterForm />
                  <div className="flex flex-col items-center mt-6 gap-2">
                    <button
                      type="submit"
                      className="bg-[#1a1a4e] text-white font-semibold py-2.5 px-16 rounded-full hover:bg-[#2a2a6e] shadow-sm hover:shadow-md transition-all text-sm"
                    >
                      Creare cont
                    </button>
                    <p className="text-xs text-gray-500">
                      Ai deja cont?{' '}
                      <Link
                        to="/autentificare"
                        className="text-[#1a1a4e] font-semibold hover:underline"
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
  );
};

export default RegisterPage;
