import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import './ForgotPasswordPage.css';
import AnimatedBackground from '../../components/AnimatedBackground';

const inputBase =
  "w-full h-10 rounded-full bg-[#12162a] border border-white/15 px-10 text-white text-sm " +
  "placeholder:text-white/60 outline-none transition " +
  "focus:ring-2 focus:ring-violet-300/55 focus:border-violet-300/55 hover:border-white/25";

const iconWrap = "absolute left-3 top-1/2 -translate-y-1/2 text-white/70";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    return email.trim() !== '' && email.includes('@');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Introduceți adresa de email');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Adresa de email nu este validă');
      return;
    }
    
    console.log('Password reset requested for:', email);
    // TODO: Connect to backend API
    setIsSubmitted(true);
  };

  const isValidEmail = validateEmail(email);

  return (
    <div className="min-h-screen w-full text-white flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="relative w-full max-w-4xl min-h-[500px] overflow-hidden rounded-[26px] border border-violet-300/70 shadow-[0_0_30px_rgba(168,85,247,0.45)] bg-[#111427]">
        {/* Background diagonal */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[#111427]" />
          <div
            className="absolute inset-0 opacity-95 bg-gradient-to-b from-[#8b5cf6] via-[#4c1d95] to-[#0b0f1f]"
            style={{ clipPath: "polygon(0 0, 60% 0, 40% 100%, 0 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(39.2% 100%, 40% 100%, 60% 0, 59.2% 0)",
              background: "rgba(168,85,247,0.9)",
              filter: "blur(0.2px)",
            }}
          />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 h-full min-h-[500px]">
          {/* Left text */}
          <div className="hidden md:flex items-center justify-center p-8 pointer-events-none">
            <div className="w-full max-w-md">
              <h2 className="text-4xl font-extrabold leading-tight">Recuperare parolă</h2>
              <p className="mt-4 text-white/85 text-base">
                Introdu adresa de e-mail asociată contului tău și îți vom trimite un link pentru resetarea parolei.
              </p>
            </div>
          </div>

          {/* Right form */}
          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-[360px]">
              <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 md:hidden">Recuperare parolă</h1>
              <p className="text-white/70 text-sm text-center mb-6 md:hidden">
                Introdu adresa de e-mail asociată contului tău.
              </p>

              {!isSubmitted ? (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className={iconWrap} size={16} />
                      <input
                        name="email"
                        type="email"
                        className={`${inputBase} ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30' : ''}`}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                      />
                    </div>
                    {error && (
                      <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!isValidEmail}
                    className={`w-full h-10 rounded-full font-extrabold text-[#0b0f1f] transition-all ${
                      isValidEmail 
                        ? 'bg-gradient-to-b from-violet-300 to-violet-700 shadow-[0_0_18px_rgba(168,85,247,0.45)] hover:shadow-[0_0_24px_rgba(168,85,247,0.6)]' 
                        : 'bg-gradient-to-b from-violet-300/50 to-violet-700/50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Trimite link-ul de resetare
                  </button>

                  <div className="text-center text-sm text-white/70">
                    Ți-ai amintit parola?{' '}
                    <Link
                      to="/login"
                      className="text-violet-300 font-bold hover:underline"
                    >
                      Autentifică-te
                    </Link>
                  </div>
                </form>
              ) : (
                /* Success Message */
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-violet-500/20 rounded-full flex items-center justify-center border border-violet-300/30">
                    <CheckCircle size={32} className="text-violet-300" />
                  </div>
                  <p className="text-white/80 text-sm mb-6">
                    Dacă adresa <span className="font-semibold text-violet-300">{email}</span> este asociată unui cont, vei primi un e-mail cu instrucțiuni pentru resetarea parolei.
                  </p>
                  <Link
                    to="/login"
                    className="inline-block w-full h-10 leading-10 rounded-full bg-gradient-to-b from-violet-300 to-violet-700 shadow-[0_0_18px_rgba(168,85,247,0.45)] font-extrabold text-[#0b0f1f] text-center transition-all hover:shadow-[0_0_24px_rgba(168,85,247,0.6)]"
                  >
                    Înapoi la autentificare
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
