import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import InputGroup from '../../components/ui/InputGroup';
import { Mail } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    // TODO: Connect to backend API
    setIsSubmitted(true);
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
            <h1 className="text-2xl font-bold text-[#1a1a4e] mb-2">Recuperare parolă</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Introdu adresa de e-mail asociată contului tău și îți vom trimite un link pentru resetarea parolei.
            </p>
          </div>

          {!isSubmitted ? (
            /* Form */
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5 w-full animate-fade-in">
                <InputGroup
                  label="E-mail"
                  type="email"
                  icon={<Mail size={14} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <button
                  type="submit"
                  className="w-full bg-[#DFF3E4] text-[#1a1a4e] font-bold py-3 px-8 rounded-full hover:bg-[#c5e8ce] shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm border border-[#c5e8ce]"
                >
                  Trimite link-ul de resetare
                </button>

                <p className="text-sm text-gray-500">
                  Ți-ai amintit parola?{' '}
                  <Link
                    to="/autentificare"
                    className="text-[#1a1a4e] font-bold hover:underline"
                  >
                    Autentifică-te
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#DFF3E4] rounded-full flex items-center justify-center">
                <Mail size={28} className="text-[#1a1a4e]" />
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Dacă adresa <span className="font-semibold text-[#1a1a4e]">{email}</span> este asociată unui cont, vei primi un e-mail cu instrucțiuni pentru resetarea parolei.
              </p>
              <Link
                to="/autentificare"
                className="inline-block w-full bg-[#DFF3E4] text-[#1a1a4e] font-bold py-3 px-8 rounded-full hover:bg-[#c5e8ce] shadow-md transition-all text-sm border border-[#c5e8ce]"
              >
                Înapoi la autentificare
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
