<<<<<<< HEAD
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
=======
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

type WipeDir = "toRegister" | "toLogin";

const PAGE_WIPE_MS = 820;
const NAV_AT_MS = 420;

const inputBase =
  "w-full h-8 rounded-full bg-[#12162a] border border-white/15 px-9 pr-10 text-white text-sm " +
  "placeholder:text-white/75 placeholder:font-semibold outline-none transition " +
  "focus:ring-2 focus:ring-violet-300/55 focus:border-violet-300/55 hover:border-white/25";

const iconWrap = "absolute left-3 top-1/2 -translate-y-1/2 text-white/90";

function WipeOverlay({
  stage,
  dir,
  mode,
}: {
  stage: "in" | "out";
  dir: WipeDir;
  mode: "exit" | "enter";
}) {
  const x =
    mode === "exit"
      ? dir === "toRegister"
        ? stage === "in"
          ? "translate-x-[120%]"
          : "translate-x-0"
        : stage === "in"
        ? "-translate-x-[120%]"
        : "translate-x-0"
      : dir === "toRegister"
      ? stage === "in"
        ? "translate-x-0"
        : "-translate-x-[120%]"
      : stage === "in"
      ? "translate-x-0"
      : "translate-x-[120%]";

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-[26px]">
      <div
        className={[
          "absolute inset-y-0 left-0 w-[165%]",
          "bg-gradient-to-br from-violet-600 via-violet-500 to-violet-800",
          "shadow-[0_0_60px_rgba(168,85,247,0.55)]",
          "transition-transform duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          x,
        ].join(" ")}
        style={{ clipPath: "polygon(0 0, 72% 0, 56% 100%, 0 100%)" }}
      />
      <div
        className={[
          "absolute inset-y-0 left-0 w-[165%]",
          "transition-transform duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          x,
        ].join(" ")}
        style={{
          clipPath: "polygon(70% 0, 72% 0, 56% 100%, 54% 100%)",
          background: "rgba(255,255,255,0.22)",
          filter: "blur(0.4px)",
        }}
      />
    </div>
  );
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [navWipe, setNavWipe] = useState<null | { stage: "in" | "out"; dir: WipeDir; mode: "exit" | "enter" }>(
    null
  );

  // ✅ enter wipe dacă vii din register
  useEffect(() => {
    const dir = location?.state?.authEnterDir as WipeDir | undefined;
    if (!dir) return;

    setNavWipe({ dir, mode: "enter", stage: "in" });
    requestAnimationFrame(() => requestAnimationFrame(() => setNavWipe({ dir, mode: "enter", stage: "out" })));

    navigate(location.pathname, { replace: true, state: null });

    const t = setTimeout(() => setNavWipe(null), PAGE_WIPE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goRegisterWithAnim = () => {
    if (navWipe) return;
    const dir: WipeDir = "toRegister";

    setNavWipe({ dir, mode: "exit", stage: "in" });
    requestAnimationFrame(() => requestAnimationFrame(() => setNavWipe({ dir, mode: "exit", stage: "out" })));

    setTimeout(() => {
      navigate("/inregistrare", { state: { authEnterDir: dir } });
    }, NAV_AT_MS);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    if (!email || !password) {
      setError("Completează email și parolă.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);

    console.log("LOGIN:", { email, password });
  }

  const container = useMemo(
    () =>
      "relative w-full max-w-4xl h-[84vh] max-h-[620px] min-h-[520px] overflow-hidden rounded-[26px] " +
      "border border-violet-300/70 shadow-[0_0_30px_rgba(168,85,247,0.45)] bg-[#111427]",
    []
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0b0f1f] text-white flex items-center justify-center p-4">
      <div className={container}>
        {/* background diagonal */}
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

        {/* page wipe overlay */}
        {navWipe && <WipeOverlay stage={navWipe.stage} dir={navWipe.dir} mode={navWipe.mode} />}

        <div className="relative grid grid-cols-1 md:grid-cols-2 h-full">
          {/* left form */}
          <div className="flex items-center justify-center p-5 md:pl-16 md:pr-10 overflow-hidden">
            <div className="w-full max-w-[420px] origin-top scale-[0.92] pt-3">
              <h1 className="text-3xl md:text-5xl font-extrabold text-center">Autentificare</h1>
              <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.25em] text-center text-white/60">
                intră în cont
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <div className="relative">
                  <Mail className={iconWrap} size={16} />
                  <input name="email" type="email" className={inputBase} placeholder="Email" />
                </div>

                <div className="relative">
                  <Lock className={iconWrap} size={16} />
                  <input name="password" type="password" className={inputBase} placeholder="Parola" />
                </div>

                <div className="flex items-center justify-between text-sm text-white/75 pt-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-violet-400" />
                    Ține-mă minte
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-violet-300 font-semibold hover:underline"
                  >
                    Ai uitat parola?
                  </button>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full h-9 rounded-full border-2 border-violet-400 font-semibold relative overflow-hidden disabled:opacity-60"
                >
                  <span className="relative z-10">{loading ? "Se autentifică..." : "Autentificare"}</span>
                  <span className="absolute inset-0 -top-full h-[300%] w-full bg-[linear-gradient(#1a1a2e,#a855f7,#1a1a2e,#a855f7)] transition-all duration-500 hover:top-0" />
                </button>

                <div className="text-center text-sm text-white/80">
                  Nu ai cont?{" "}
                  <button
                    type="button"
                    onClick={goRegisterWithAnim}
                    className="text-violet-300 font-bold hover:underline"
                  >
                    Înregistrează-te
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* right text */}
          <div className="hidden md:flex items-center justify-center p-8 pointer-events-none">
            <div className="w-full max-w-md text-right">
              <h2 className="text-4xl font-extrabold leading-tight">
                Bine ai venit
                <br />
                înapoi
              </h2>
              <p className="mt-4 text-white/85 text-base">Intră în cont ca să continui.</p>
            </div>
          </div>
>>>>>>> 202a381 (Local frontend state before syncing with remote)
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
