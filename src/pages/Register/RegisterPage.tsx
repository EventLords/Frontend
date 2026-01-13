<<<<<<< HEAD
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
=======
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  User,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Building2,
  ChevronDown,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type WipeDir = "toRegister" | "toLogin";

const PAGE_WIPE_MS = 820;
const NAV_AT_MS = 420;

const faculties = [
  "Facultatea de Informatică",
  "Facultatea de Economie",
  "Facultatea de Drept",
  "Facultatea de Inginerie",
];

const specializations = ["Informatică", "Calculatoare", "Automatică", "Marketing", "Finanțe"];
const studyYears = ["I", "II", "III", "IV", "Master I", "Master II"];
const orgTypes = ["Asociație studențească", "ONG", "Companie", "Departament universitar", "Alt tip"];

// ✅ mai compact + text mai mic, dar placeholder vizibil
const inputBase =
  "w-full h-8 rounded-full bg-[#12162a] border border-white/15 px-9 pr-10 text-white text-sm " +
  "placeholder:text-white/75 placeholder:font-semibold outline-none transition " +
  "focus:ring-2 focus:ring-violet-300/55 focus:border-violet-300/55 hover:border-white/25";

const iconWrap = "absolute left-3 top-1/2 -translate-y-1/2 text-white/90";

function FancySelect({
  name,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  icon: LucideIcon;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <input type="hidden" name={name} value={value} />

      {/* ✅ aliniere ca la Email: icon stânga + text stânga + săgeată dreapta */}
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={[
          inputBase,
          "relative flex items-center text-left",
          open ? "ring-2 ring-violet-300/55 border-violet-300/55" : "",
        ].join(" ")}
      >
        <Icon size={16} className={iconWrap} />

        <span
          className={[
            "flex-1 min-w-0 truncate whitespace-nowrap",
            value ? "text-white" : "text-white/75 font-semibold",
          ].join(" ")}
        >
          {value || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={[
            "absolute right-3 top-1/2 -translate-y-1/2 text-white/85 transition-transform",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-violet-300/30 bg-[#0b0f1f]/95 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
          <div className="max-h-56 overflow-auto py-1">
            {options.map((opt) => {
              const active = opt === value;
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={[
                    "w-full px-3 py-2 text-left text-[13px] flex items-center justify-between transition",
                    active ? "bg-violet-500/20 text-white" : "text-white/90 hover:bg-white/10",
                  ].join(" ")}
                >
                  <span className="truncate">{opt}</span>
                  {active && <Check size={16} className="text-violet-200" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function WipeOverlay({
  stage,
  dir,
  mode,
}: {
  stage: "in" | "out";
  dir: WipeDir;
  mode: "exit" | "enter";
}) {
  // exit: offscreen -> center (0)
  // enter: center (0) -> offscreen
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
      {/* highlight line */}
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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [isOrganizer, setIsOrganizer] = useState(false);

  // ✅ PPT-like wipe pentru switch rol
  const [roleWipeOn, setRoleWipeOn] = useState(false);
  const [roleWipeStage, setRoleWipeStage] = useState<"in" | "out">("in");
  const [roleDir, setRoleDir] = useState<"toOrg" | "toStudent">("toOrg");

  // ✅ page wipe (enter/exit) între login/register
  const [navWipe, setNavWipe] = useState<null | { stage: "in" | "out"; dir: WipeDir; mode: "exit" | "enter" }>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [facultate, setFacultate] = useState("");
  const [specializare, setSpecializare] = useState("");
  const [anStudiu, setAnStudiu] = useState("");
  const [tipOrg, setTipOrg] = useState("");

  // ✅ enter animation dacă vii din login
  useEffect(() => {
    const dir = location?.state?.authEnterDir as WipeDir | undefined;
    if (!dir) return;

    setNavWipe({ dir, mode: "enter", stage: "in" });
    requestAnimationFrame(() => requestAnimationFrame(() => setNavWipe({ dir, mode: "enter", stage: "out" })));

    // curăță state ca să nu repete animația la refresh
    navigate(location.pathname, { replace: true, state: null });

    const t = setTimeout(() => setNavWipe(null), PAGE_WIPE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goLoginWithAnim = () => {
    if (navWipe) return;
    const dir: WipeDir = "toLogin";

    setNavWipe({ dir, mode: "exit", stage: "in" });
    requestAnimationFrame(() => requestAnimationFrame(() => setNavWipe({ dir, mode: "exit", stage: "out" })));

    setTimeout(() => {
      navigate("/autentificare", { state: { authEnterDir: dir } });
    }, NAV_AT_MS);
  };

  const switchRole = (nextIsOrg: boolean) => {
    if (nextIsOrg === isOrganizer) return;

    setRoleDir(nextIsOrg ? "toOrg" : "toStudent");
    setRoleWipeOn(true);
    setRoleWipeStage("in");
    requestAnimationFrame(() => requestAnimationFrame(() => setRoleWipeStage("out")));

    // schimbăm în mijlocul wipe-ului
    setTimeout(() => setIsOrganizer(nextIsOrg), 260);
    setTimeout(() => setRoleWipeOn(false), 700);
    setError(null);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);

    if (!isOrganizer) {
      const payload = {
        role: "student",
        nume: String(fd.get("nume") || ""),
        prenume: String(fd.get("prenume") || ""),
        facultate: String(fd.get("facultate") || ""),
        specializare: String(fd.get("specializare") || ""),
        anStudiu: String(fd.get("anStudiu") || ""),
        email: String(fd.get("email") || ""),
        parola: String(fd.get("parola") || ""),
      };

      if (
        !payload.nume ||
        !payload.prenume ||
        !payload.facultate ||
        !payload.specializare ||
        !payload.anStudiu ||
        !payload.email ||
        !payload.parola
      ) {
        setError("Completează toate câmpurile.");
        return;
      }

      setLoading(true);
      await new Promise((r) => setTimeout(r, 450));
      setLoading(false);

      console.log("REGISTER student:", payload);
      goLoginWithAnim();
      return;
    }

    const payload = {
      role: "organizator",
      numeResponsabil: String(fd.get("org_responsabil") || ""),
      email: String(fd.get("org_email") || ""),
      parola: String(fd.get("org_parola") || ""),
      telefon: String(fd.get("org_telefon") || ""),
      tipOrganizatie: String(fd.get("org_tip") || ""),
      numeOrganizatie: String(fd.get("org_nume") || ""),
      descriere: String(fd.get("org_descriere") || ""),
    };

    if (
      !payload.numeResponsabil ||
      !payload.email ||
      !payload.parola ||
      !payload.telefon ||
      !payload.tipOrganizatie ||
      !payload.descriere
    ) {
      setError("Completează toate câmpurile obligatorii.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);

    console.log("REGISTER organizator:", payload);
    goLoginWithAnim();
  }

  // animație form (mai mic translate ca să nu sară peste diagonală)
  const roleActive =
    "opacity-100 translate-y-0 translate-x-0 scale-100 blur-0 relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";
  const roleLeftOut =
    "opacity-0 -translate-x-6 translate-y-2 scale-[0.98] blur-md pointer-events-none absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";
  const roleRightOut =
    "opacity-0 translate-x-6 translate-y-2 scale-[0.98] blur-md pointer-events-none absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

  const container = useMemo(
    () =>
      "relative w-full max-w-4xl h-[92vh] max-h-[720px] min-h-[560px] overflow-hidden rounded-[26px] " +
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
          {/* left text */}
          <div className="hidden md:flex items-center justify-center p-8 pointer-events-none">
            <div className="w-full max-w-md">
              <h2 className="text-4xl font-extrabold leading-tight">Înregistrare</h2>
              <p className="mt-4 text-white/85 text-base">Alege rolul și completează datele.</p>
            </div>
          </div>

          {/* right form */}
          <div className="flex items-center justify-center p-5 md:pr-10 md:pl-16 overflow-hidden">
            {/* ✅ îngust + ușor micșorat ca să stea strict pe partea neagră */}
            <div className="w-full max-w-[420px] origin-top scale-[0.92]">
              <div className="pt-4">
                <h1 className="text-3xl md:text-5xl font-extrabold text-center">Înregistrare</h1>

                {/* slider compact */}
                <div className="mt-4">
                  <div className="relative w-full rounded-full bg-white/10 p-[3px] border border-white/10 backdrop-blur">
                    <div
                      className={[
                        "absolute top-[3px] bottom-[3px] w-1/2 rounded-full",
                        "bg-gradient-to-b from-violet-300 to-violet-600",
                        "shadow-[0_0_14px_rgba(168,85,247,0.45)]",
                        "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isOrganizer ? "translate-x-full" : "translate-x-0",
                      ].join(" ")}
                    />
                    <div className="relative grid grid-cols-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => switchRole(false)}
                        className={[
                          "py-1.5 rounded-full transition-colors",
                          !isOrganizer ? "text-[#0b0f1f]" : "text-white/90 hover:text-white",
                        ].join(" ")}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => switchRole(true)}
                        className={[
                          "py-1.5 rounded-full transition-colors",
                          isOrganizer ? "text-[#0b0f1f]" : "text-white/90 hover:text-white",
                        ].join(" ")}
                      >
                        Organizator
                      </button>
                    </div>
                  </div>
                </div>

                {/* role wipe overlay */}
                {roleWipeOn && (
                  <div className="relative mt-3">
                    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-[18px]">
                      <div
                        className={[
                          "absolute inset-y-0 left-0 w-[160%]",
                          "bg-gradient-to-r from-violet-700/0 via-violet-500/55 to-violet-700/0",
                          "blur-sm",
                          "transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                          roleDir === "toOrg"
                            ? roleWipeStage === "in"
                              ? "translate-x-[-120%]"
                              : "translate-x-[120%]"
                            : roleWipeStage === "in"
                            ? "translate-x-[120%]"
                            : "translate-x-[-120%]",
                        ].join(" ")}
                        style={{ clipPath: "polygon(0 0, 78% 0, 62% 100%, 0 100%)" }}
                      />
                    </div>
                  </div>
                )}

                <form onSubmit={onSubmit} className="mt-4 relative">
                  {/* STUDENT */}
                  <div className={!isOrganizer ? roleActive : roleLeftOut}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="relative">
                        <User className={iconWrap} size={16} />
                        <input name="nume" className={inputBase} placeholder="Nume" />
                      </div>

                      <div className="relative">
                        <User className={iconWrap} size={16} />
                        <input name="prenume" className={inputBase} placeholder="Prenume" />
                      </div>

                      <FancySelect
                        name="facultate"
                        value={facultate}
                        onChange={setFacultate}
                        options={faculties}
                        placeholder="Facultate"
                        icon={GraduationCap}
                      />

                      <FancySelect
                        name="specializare"
                        value={specializare}
                        onChange={setSpecializare}
                        options={specializations}
                        placeholder="Specializare"
                        icon={BookOpen}
                      />

                      <FancySelect
                        name="anStudiu"
                        value={anStudiu}
                        onChange={setAnStudiu}
                        options={studyYears}
                        placeholder="An de studiu"
                        icon={CalendarDays}
                      />

                      <div className="relative">
                        <Mail className={iconWrap} size={16} />
                        <input name="email" type="email" className={inputBase} placeholder="Email" />
                      </div>

                      <div className="relative sm:col-span-2">
                        <Lock className={iconWrap} size={16} />
                        <input name="parola" type="password" className={inputBase} placeholder="Parola" />
                      </div>
                    </div>
                  </div>

                  {/* ORGANIZATOR */}
                  <div className={isOrganizer ? roleActive : roleRightOut}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="relative sm:col-span-2">
                        <User className={iconWrap} size={16} />
                        <input name="org_responsabil" className={inputBase} placeholder="Nume responsabil" />
                      </div>

                      <div className="relative">
                        <Mail className={iconWrap} size={16} />
                        <input name="org_email" type="email" className={inputBase} placeholder="Email" />
                      </div>

                      <div className="relative">
                        <Lock className={iconWrap} size={16} />
                        <input name="org_parola" type="password" className={inputBase} placeholder="Parola" />
                      </div>

                      <div className="relative">
                        <span className={iconWrap}>☎</span>
                        <input name="org_telefon" className={inputBase} placeholder="Număr de telefon" />
                      </div>

                      <FancySelect
                        name="org_tip"
                        value={tipOrg}
                        onChange={setTipOrg}
                        options={orgTypes}
                        placeholder="Tip organizație"
                        icon={Building2}
                      />

                      <div className="relative sm:col-span-2">
                        <Building2 className={iconWrap} size={16} />
                        <input name="org_nume" className={inputBase} placeholder="Numele organizației (optional)" />
                      </div>

                      <div className="relative sm:col-span-2">
                        <span className="absolute left-3 top-2.5 text-white/90 text-sm">✎</span>
                        <textarea
                          name="org_descriere"
                          className={[
                            "w-full h-[72px] rounded-[18px]",
                            "bg-[#12162a] border border-white/15",
                            "pl-9 pr-3 py-2 text-white text-sm placeholder:text-white/75 placeholder:font-semibold outline-none transition",
                            "focus:ring-2 focus:ring-violet-300/55 focus:border-violet-300/55 hover:border-white/25",
                            "resize-none",
                          ].join(" ")}
                          placeholder="Descriere și motivul solicitării"
                        />
                      </div>
                    </div>
                  </div>

                  {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 w-full h-9 rounded-full bg-gradient-to-b from-violet-300 to-violet-700 shadow-[0_0_18px_rgba(168,85,247,0.45)] font-extrabold text-[#0b0f1f] disabled:opacity-60"
                  >
                    {loading ? "Se creează..." : "Creare cont"}
                  </button>

                  <div className="mt-2 text-center text-sm text-white/80">
                    Ai deja cont?{" "}
                    <button
                      type="button"
                      onClick={goLoginWithAnim}
                      className="text-violet-300 font-bold hover:underline"
                    >
                      Autentifică-te
                    </button>
>>>>>>> 202a381 (Local frontend state before syncing with remote)
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
<<<<<<< HEAD
=======

        <div className="pointer-events-none absolute inset-0 rounded-[26px]" />
>>>>>>> 202a381 (Local frontend state before syncing with remote)
      </div>
    </div>
  );
};

export default RegisterPage;
