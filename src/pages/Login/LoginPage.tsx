import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { LoginForm } from '../../features/auth/components/LoginForm';

const LoginPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted');
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        {/* Glass Card */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/50 w-full max-w-sm animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1a1a4e] mb-2">Autentificare</h1>
            <p className="text-gray-500 text-sm">Bine ai revenit!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <LoginForm />

            {/* Submit Button */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="submit"
                className="w-full bg-[#DFF3E4] text-[#1a1a4e] font-bold py-3 px-8 rounded-full hover:bg-[#c5e8ce] shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm border border-[#c5e8ce]"
              >
                Conectare
              </button>

              <p className="text-sm text-gray-500">
                Nu ai cont?{' '}
                <Link
                  to="/inregistrare"
                  className="text-[#1a1a4e] font-bold hover:underline"
                >
                  Înregistrează-te
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
