import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { StudentRegisterForm } from "../../features/auth/components/StudentRegisterForm";
import { OrganizerRegisterForm } from "../../features/auth/components/OrganizerRegisterForm";

type Mode = "login" | "register";

const DURATION_MS = 820; // sincron cu overlay transition

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL -> mode
  const urlMode: Mode = location.pathname === "/inregistrare" ? "register" : "login";

  const [mode, setMode] = useState<Mode>(urlMode);
  const [isOrganizer, setIsOrganizer] = useState(false);

  // page transition state
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);

  // PPT-like wipe for role switch
  const [roleWipeOn, setRoleWipeOn] = useState(false);
  const [roleWipeStage, setRoleWipeStage] = useState<"in" | "out">("in");

  // sync when user enters route directly
  useEffect(() => {
    setMode(urlMode);
  }, [urlMode]);

  const isLogin = mode === "login";

  const goMode = (next: Mode) => {
    if (next === mode || isSwitchingMode) return;

    setIsSwitchingMode(true);
    setMode(next); // pornim animația imediat

    // după animație, sincronizăm URL-ul (ca să fie corect în browser)
    setTimeout(() => {
      navigate(next === "login" ? "/autentificare" : "/inregistrare", { replace: true });
      setIsSwitchingMode(false);
    }, DURATION_MS);
  };

  const switchRole = (nextIsOrg: boolean) => {
    if (nextIsOrg === isOrganizer) return;

    // start wipe
    setRoleWipeOn(true);
    setRoleWipeStage("in");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRoleWipeStage("out"));
    });

    // schimbăm conținutul în mijlocul wipe-ului
    setTimeout(() => setIsOrganizer(nextIsOrg), 260);
    setTimeout(() => setRoleWipeOn(false), 620);
  };

  const roleActive = "opacity-100 translate-x-0 blur-0 relative";
 const roleLeftOut  = "opacity-0 -translate-x-6 blur-md pointer-events-none absolute inset-0";
const roleRightOut = "opacity-0 translate-x-6 blur-md pointer-events-none absolute inset-0";

  // overlay position (cortina)
  const overlayTranslate = isLogin ? "translate-x-full" : "translate-x-0";
  const overlayRadius = isLogin ? "30px 0 0 30px" : "0 30px 30px 0";

  const container = useMemo(
    () =>
      [
        "relative w-[1200px] max-w-full h-[680px] max-h-[90vh]",
        "overflow-hidden rounded-[30px]",
        "bg-[#111427]",
        "border border-violet-300/70 shadow-[0_0_30px_rgba(168,85,247,0.45)]",
      ].join(" "),
    []
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0b0f1f] text-white flex items-center justify-center p-4">
      <div className={container}>
        {/* diagonal purple background (fix) */}
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

        {/* LEFT SIDE: form area */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 h-full">
          {/* FORM ZONE */}
          <div className="relative flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
              {/* TITLES */}
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold">
                  {isLogin ? "Bine ai revenit!" : "Creare cont"}
                </h1>
                <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.25em] text-white/60">
                  {isLogin ? "Autentificare în cont" : "Înregistrează-te rapid"}
                </p>
              </div>

              {/* CONTENT */}
              <div className="mt-10 relative">
                {/* LOGIN */}
                <div
                  className={[
                    "transition-all duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isLogin ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12 pointer-events-none absolute inset-0",
                  ].join(" ")}
                >
                  {/* normalize style for your form (dacă are inputs diferite) */}
                  <div
                    className={[
                      "[&_label]:!text-white/80",
                      "[&_input]:!bg-transparent [&_input]:!text-white",
                      "[&_input]:placeholder:!text-white/30",
                      "[&_input]:!border-0 [&_input]:!border-b-2",
                      "[&_input]:!border-white/60 [&_input]:focus:!border-violet-300",
                      "[&_input]:focus:!outline-none [&_input]:!rounded-none",
                      "[&_button]:!rounded-full [&_button]:!font-bold",
                    ].join(" ")}
                  >
                    <LoginForm />
                  </div>

                  <div className="mt-6 text-center text-sm text-white/80">
                    Nu ai cont?{" "}
                    <button
                      type="button"
                      onClick={() => goMode("register")}
                      className="text-violet-300 font-bold hover:underline"
                    >
                      Înregistrează-te
                    </button>
                  </div>
                </div>

                {/* REGISTER */}
                <div
                  className={[
                    "transition-all duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    !isLogin ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12 pointer-events-none absolute inset-0",
                  ].join(" ")}
                >
                  {/* Role switcher */}
                  <div className="mb-8">
                    <div className="relative w-full rounded-full bg-white/10 p-1 border border-white/10 backdrop-blur">
                      <div
                        className={[
                          "absolute top-1 bottom-1 w-1/2 rounded-full",
                          "bg-gradient-to-b from-violet-300 to-violet-600",
                          "shadow-[0_0_18px_rgba(168,85,247,0.55)]",
                          "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isOrganizer ? "translate-x-full" : "translate-x-0",
                        ].join(" ")}
                      />
                      <div className="relative grid grid-cols-2 text-sm font-bold">
                        <button
                          type="button"
                          onClick={() => switchRole(false)}
                          className={[
                            "py-2 rounded-full transition-colors",
                            !isOrganizer ? "text-[#0b0f1f]" : "text-white/80 hover:text-white",
                          ].join(" ")}
                        >
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => switchRole(true)}
                          className={[
                            "py-2 rounded-full transition-colors",
                            isOrganizer ? "text-[#0b0f1f]" : "text-white/80 hover:text-white",
                          ].join(" ")}
                        >
                          Organizator
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PPT wipe overlay just for forms */}
                  {roleWipeOn && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      <div
                        className={[
                          "absolute inset-y-0 left-0 w-[140%]",
                          "bg-gradient-to-r from-violet-700/0 via-violet-500/55 to-violet-700/0",
                          "blur-sm",
                          "transition-transform duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                          roleWipeStage === "in" ? "-translate-x-[120%]" : "translate-x-[120%]",
                        ].join(" ")}
                      />
                    </div>
                  )}

                  {/* forms with slide/blur transition */}
                  <div
                    className={[
                      "relative",
                      "[&_label]:!text-white/80",
                      "[&_input]:!bg-transparent [&_input]:!text-white",
                      "[&_input]:placeholder:!text-white/30",
                      "[&_input]:!border-0 [&_input]:!border-b-2",
                      "[&_input]:!border-white/60 [&_input]:focus:!border-violet-300",
                      "[&_input]:focus:!outline-none [&_input]:!rounded-none",
                      "[&_button]:!rounded-full [&_button]:!font-bold",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        !isOrganizer ? roleActive : roleLeftOut,
                      ].join(" ")}
                    >
                      <StudentRegisterForm />
                    </div>

                    <div
                      className={[
                        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isOrganizer ? roleActive : roleRightOut,
                      ].join(" ")}
                    >
                      <OrganizerRegisterForm />
                    </div>
                  </div>

                  <div className="mt-6 text-center text-sm text-white/80">
                    Ai deja cont?{" "}
                    <button
                      type="button"
                      onClick={() => goMode("login")}
                      className="text-violet-300 font-bold hover:underline"
                    >
                      Autentifică-te
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: blank area under overlay (just for balance on desktop) */}
          <div className="hidden md:block relative" />
        </div>

        {/* OVERLAY (cortina) */}
        <div
          className={[
            "hidden md:block absolute top-0 left-0 h-full w-1/2 overflow-hidden",
            "transition-transform duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-30",
            overlayTranslate,
          ].join(" ")}
          style={{ borderRadius: overlayRadius }}
        >
          <div
            className={[
              "bg-gradient-to-br from-[#0f0c29] via-[#1a1a4e] to-[#6c63ff]",
              "relative -left-full h-full w-[200%]",
              "transform transition-transform duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              isLogin ? "translate-x-1/2" : "translate-x-0",
            ].join(" ")}
          >
            {/* Overlay LEFT text (when on register) */}
            <div
              className={[
                "absolute top-0 flex flex-col items-center justify-center h-full w-1/2 px-12 text-center",
                "transition-transform duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                !isLogin ? "translate-x-0" : "-translate-x-[20%]",
              ].join(" ")}
            >
              <h2 className="text-5xl font-extrabold text-white mb-6">Ai deja cont?</h2>
              <p className="text-white/90 text-lg mb-8 font-light">
                Autentifică-te ca să rămâi conectat cu evenimentele din campus.
              </p>
              <button
                type="button"
                onClick={() => goMode("login")}
                className="mt-2 bg-transparent border-2 border-white text-white text-sm font-bold uppercase px-12 py-3 rounded-full tracking-widest transition-transform hover:bg-white hover:text-[#1a1a4e] active:scale-95"
              >
                Mergi la autentificare
              </button>
            </div>

            {/* Overlay RIGHT text (when on login) */}
            <div
              className={[
                "absolute top-0 right-0 flex flex-col items-center justify-center h-full w-1/2 px-12 text-center",
                "transition-transform duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                isLogin ? "translate-x-0" : "translate-x-[20%]",
              ].join(" ")}
            >
              <h2 className="text-5xl font-extrabold text-white mb-6">Nu ai cont?</h2>
              <p className="text-white/90 text-lg mb-8 font-light">
                Introdu datele tale personale și începe călătoria alături de noi.
              </p>
              <button
                type="button"
                onClick={() => goMode("register")}
                className="mt-2 bg-transparent border-2 border-white text-white text-sm font-bold uppercase px-12 py-3 rounded-full tracking-widest transition-transform hover:bg-white hover:text-[#1a1a4e] active:scale-95"
              >
                Mergi la înregistrare
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
