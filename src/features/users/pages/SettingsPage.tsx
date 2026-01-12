import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Shield,
  ArrowLeft,
} from "lucide-react";

// Correct import path assuming this file is in src/features/users/pages/
import { profileService } from "../../../services/profileService";
import AnimatedBackground from "../../../components/AnimatedBackground";
import "./SettingsPage.css";

const SettingsPage: React.FC = () => {
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword) {
      setPasswordError("Introduceți parola curentă");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Parola nouă trebuie să aibă minim 8 caractere");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Parolele nu coincid");
      return;
    }

    setIsChangingPassword(true);

    try {
      await profileService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error: any) {
      console.error("Change password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Eroare la schimbarea parolei.";
      setPasswordError(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "STERGE") {
      return;
    }

    try {
      // ✅ Call the real backend delete endpoint
      await profileService.deleteAccount();

      console.log("Account deleted successfully.");

      // Clear local data and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Delete account error", error);
      alert("Nu s-a putut șterge contul. Vă rugăm încercați din nou.");
    }
  };

  const location = useLocation();
  const isOrganizer = location.pathname.startsWith("/organizer");
  const dashboardPath = isOrganizer
    ? "/organizer/dashboard"
    : "/student/dashboard";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative">
      <AnimatedBackground />
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Setări cont
          </h1>
          <Link
            to={dashboardPath}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Înapoi</span>
          </Link>
        </div>
        <p className="text-white/60">
          Gestionează securitatea și preferințele contului tău
        </p>
      </div>

      <div className="space-y-8">
        {/* Password Change Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <Lock size={20} className="text-[#a78bfa]" />
            <h2 className="text-lg font-semibold text-white">Schimbă parola</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Parola curentă
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Parola nouă
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
                  placeholder="Minim 8 caractere"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Confirmă parola nouă
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
                  placeholder="Repetă parola nouă"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {passwordError && (
              <div className="flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertTriangle size={16} />
                {passwordError}
              </div>
            )}

            {/* Success Message */}
            {passwordSuccess && (
              <div className="flex items-center gap-2 text-green-400 text-sm animate-in fade-in slide-in-from-top-1">
                <Check size={16} />
                Parola a fost schimbată cu succes!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f] font-semibold rounded-xl hover:shadow-[0_0_18px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Se procesează...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Schimbă parola
                </>
              )}
            </button>
          </form>
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-500/30 flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">
              Zonă periculoasă
            </h2>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-white font-medium">Șterge contul</p>
                <p className="text-sm text-white/50">
                  Această acțiune este ireversibilă. Toate datele vor fi șterse
                  permanent.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/30 border border-red-500/30 transition-colors flex items-center gap-2 shrink-0"
              >
                <Trash2 size={16} />
                Șterge contul
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md bg-[#1a1a4e] rounded-2xl shadow-2xl p-6 border border-white/10 animate-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ești sigur?</h3>
              <p className="text-white/60 text-sm">
                Această acțiune nu poate fi anulată. Contul tău și toate datele
                asociate vor fi șterse permanent.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-2">
                Scrie <span className="font-bold text-red-400">STERGE</span>{" "}
                pentru a confirma
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder="STERGE"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 px-4 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "STERGE"}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Șterge definitiv
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
