<<<<<<< HEAD
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import InputGroup from '../../components/ui/InputGroup';
import { Mail } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
=======
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const inputBase =
  "w-full h-8 rounded-full bg-[#12162a] border border-white/15 px-9 pr-10 text-white text-sm " +
  "placeholder:text-white/75 placeholder:font-semibold outline-none transition " +
  "focus:ring-2 focus:ring-violet-300/55 focus:border-violet-300/55 hover:border-white/25";

const iconWrap = "absolute left-3 top-1/2 -translate-y-1/2 text-white/90";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
>>>>>>> 202a381 (Local frontend state before syncing with remote)
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
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
=======
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
  };

  const container = useMemo(
    () =>
      "relative w-full max-w-4xl h-[84vh] max-h-[620px] min-h-[520px] overflow-hidden rounded-[26px] " +
      "border border-violet-300/70 shadow-[0_0_30px_rgba(168,85,247,0.45)] bg-[#111427]",
    []
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0b0f1f] text-white flex items-center justify-center p-4">
      <div className={container}>
        {/* diagonal purple background */}
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

        <div className="relative grid grid-cols-1 md:grid-cols-2 h-full">
          {/* LEFT TEXT (doar informativ) */}
          <div className="hidden md:flex items-center justify-center p-8 pointer-events-none">
            <div className="w-full max-w-md">
              <p className="text-white/85 text-base leading-relaxed">
                Primești un link pe e-mail și îți setezi o parolă nouă în câteva secunde.
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex items-center justify-center p-5 md:pr-10 md:pl-16 overflow-hidden">
            <div className="w-full max-w-[420px] origin-top scale-[0.92] pt-3">
              <h1 className="text-3xl md:text-5xl font-extrabold text-center">Recuperează parola</h1>

              {/* ✅ doar asta în dreapta */}
              <p className="mt-3 text-sm text-center text-white/70">
                Introdu adresa de e-mail asociată contului.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <div className="relative">
                    <Mail className={iconWrap} size={16} />
                    <input
                      name="email"
                      type="email"
                      className={inputBase}
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full h-9 rounded-full border-2 border-violet-400 font-semibold relative overflow-hidden"
                  >
                    <span className="relative z-10">Trimite link-ul</span>
                    <span className="absolute inset-0 -top-full h-[300%] w-full bg-[linear-gradient(#1a1a2e,#a855f7,#1a1a2e,#a855f7)] transition-all duration-500 hover:top-0" />
                  </button>

                  <div className="text-center text-sm text-white/80 pt-1">
                    Ți-ai amintit parola?{" "}
                    <Link to="/autentificare" className="text-violet-300 font-bold hover:underline">
                      Autentifică-te
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="mt-7 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-violet-500/20 border border-violet-300/30 flex items-center justify-center">
                    <Mail size={22} className="text-violet-200" />
                  </div>

                  <p className="text-white/80 text-sm leading-relaxed">
                    Dacă adresa <span className="font-semibold text-white">{email}</span> este asociată unui cont,
                    vei primi un e-mail cu instrucțiuni.
                  </p>

                  <Link
                    to="/autentificare"
                    className="mt-6 inline-flex items-center justify-center w-full h-9 rounded-full bg-gradient-to-b from-violet-300 to-violet-700 shadow-[0_0_18px_rgba(168,85,247,0.45)] font-extrabold text-[#0b0f1f]"
                  >
                    Înapoi la autentificare
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[26px]" />
>>>>>>> 202a381 (Local frontend state before syncing with remote)
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
