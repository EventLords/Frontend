import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginFormData } from "../../types/auth";
import authService from "../../services/authService";
import { Mail, Lock } from "lucide-react";
import "./LoginPage.css";
import AnimatedBackground from "../../components/AnimatedBackground";

const inputBase =
  "w-full h-10 rounded-full bg-[#12162a] border border-white/15 px-10 text-white text-sm " +
  "placeholder:text-white/60 outline-none transition " +
  "focus:ring-2 focus:ring-violet-300/55 focus:border-violet-300/55 hover:border-white/25";

const iconWrap = "absolute left-3 top-1/2 -translate-y-1/2 text-white/70";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user types
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Clear API error when user types to improve UX
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email-ul este obligatoriu";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalid";
    }

    if (!formData.password) {
      newErrors.password = "Parola este obligatorie";
    } else if (formData.password.length < 6) {
      newErrors.password = "Parola trebuie să aibă minim 6 caractere";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Navigate based on user role (backend returns uppercase: STUDENT, ORGANIZER, ADMIN)
      const userRole = response.user.role;
      if (userRole === "STUDENT") {
        navigate("/student/dashboard");
      } else if (userRole === "ORGANIZER") {
        navigate("/organizer/dashboard");
      } else if (userRole === "ADMIN") {
        navigate("/admin");
      } else {
        // Default fallback
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login process error:", error);

      // Enhanced Error Handling logic
      let errorMessage = "A apărut o eroare. Încearcă din nou.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400 || status === 401) {
          // Typically "Bad Request" or "Unauthorized" for login means wrong credentials
          errorMessage = data?.message || "Email sau parolă incorectă";
        } else if (status === 500) {
          errorMessage =
            "Eroare internă server. Te rugăm să încerci mai târziu.";
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Nu s-a putut contacta serverul. Verifică conexiunea.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || "Eroare necunoscută.";
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
              <h2 className="text-4xl font-extrabold leading-tight">
                Autentificare
              </h2>
              <p className="mt-4 text-white/85 text-base">
                Bine ai revenit! Conectează-te la contul tău.
              </p>
            </div>
          </div>

          {/* Right form */}
          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-[360px]">
              <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 md:hidden">
                Autentificare
              </h1>

              {/* API Error Display */}
              {apiError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl max-w-full overflow-hidden animate-pulse">
                  <p className="text-red-300 text-sm text-center break-words font-medium">
                    {apiError}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="relative">
                      <Mail className={iconWrap} size={16} />
                      <input
                        name="email"
                        type="email"
                        className={`${inputBase} ${
                          errors.email
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/50"
                            : ""
                        }`}
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 ml-2 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <Lock className={iconWrap} size={16} />
                      <input
                        name="password"
                        type="password"
                        className={`${inputBase} ${
                          errors.password
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/50"
                            : ""
                        }`}
                        placeholder="Parolă"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1 ml-2 font-medium">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Forgot password link */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-violet-300/80 hover:text-violet-300 hover:underline transition-colors"
                  >
                    Ai uitat parola?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-full bg-gradient-to-b from-violet-300 to-violet-700 shadow-[0_0_18px_rgba(168,85,247,0.45)] font-extrabold text-[#0b0f1f] disabled:opacity-60 transition-all hover:shadow-[0_0_24px_rgba(168,85,247,0.6)] active:scale-95"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Se conectează...
                    </span>
                  ) : (
                    "Conectare"
                  )}
                </button>

                <div className="text-center text-sm text-white/70">
                  Nu ai cont?{" "}
                  <Link
                    to="/register"
                    className="text-violet-300 font-bold hover:underline"
                  >
                    Înregistrează-te
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
