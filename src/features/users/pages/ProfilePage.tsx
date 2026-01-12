import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Edit2,
  Check,
  X,
  Camera,
  ArrowLeft,
  Save,
  Loader,
  GraduationCap,
  AlertCircle,
  Building2,
  Trash2,
} from "lucide-react";

import { profileService } from "../../../services/profileService";
import { facultiesService } from "../../../services/facultiesService";
import AnimatedBackground from "../../../components/AnimatedBackground";

// Interfața aliniată cu datele reale din Backend
interface UserProfile {
  id_user: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone?: string;
  organization_name?: string | null;
  organization_type?: string | null;
  faculty_id?: number | null;
  specialization_id?: number | null;
  study_cycle?: string | null;
  study_year?: string | number | null;
  created_at?: string;
}

const ProfilePage: React.FC = () => {
  // State Profile
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State Date Academice (Dinamice din Backend)
  const [faculties, setFaculties] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);

  // State Editare
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Avatar State
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ FETCH DATE (Profil + Facultăți + Specializări)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [userData, facultiesData] = await Promise.all([
          profileService.getMyProfile(),
          facultiesService.getAllFaculties(),
        ]);

        // Mapăm datele din snake_case (DB) în camelCase (UI) pentru a evita erorile TS
        const mappedUser: UserProfile = {
          ...userData,
          id_user: userData.id_user,
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          phone: userData.phone || "",
          role: userData.role || "STUDENT",
        };

        setUser(mappedUser);
        setFaculties(facultiesData);
        setEditForm({
          firstName: mappedUser.firstName,
          lastName: mappedUser.lastName,
          phone: mappedUser.phone || "",
        });

        if (mappedUser.faculty_id) {
          const specsData = await facultiesService.getSpecializationsByFaculty(
            mappedUser.faculty_id
          );
          setSpecializations(specsData);
        }

        const uniqueKey = `profile_image_${mappedUser.id_user}`;
        const savedImage = localStorage.getItem(uniqueKey);
        if (savedImage) setProfileImage(savedImage);
      } catch (err: any) {
        console.error("Load error:", err);
        setError("Nu am putut încărca datele contului.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // ✅ HELPERS AFIȘARE
  const getFacultyDisplayName = () => {
    if (!user?.faculty_id) return "Nespecificată";
    const found = faculties.find((f) => f.id_faculty === user.faculty_id);
    return found ? found.name : `Facultate (ID: ${user.faculty_id})`;
  };

  const getSpecDisplayName = () => {
    if (!user?.specialization_id) return "Nespecificată";
    const found = specializations.find(
      (s) => s.id_specialization === user.specialization_id
    );
    return found ? found.name : `Specializare (ID: ${user.specialization_id})`;
  };

  const handleSaveProfile = async () => {
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) return;
    setIsSaving(true);
    try {
      await profileService.updateProfile({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
      });
      setUser((prev) => (prev ? { ...prev, ...editForm } : null));
      window.dispatchEvent(new Event("profile-updated"));
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert("Eroare la salvare.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 300;
          let w = img.width,
            h = img.height;
          if (w > h) {
            if (w > MAX) {
              h *= MAX / w;
              w = MAX;
            }
          } else {
            if (h > MAX) {
              w *= MAX / h;
              h = MAX;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, w, h);
          setTempProfileImage(canvas.toDataURL("image/jpeg", 0.7));
          setImageChanged(true);
        };
      };
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveImage = () => {
    if (!tempProfileImage || !user) return;
    localStorage.setItem(`profile_image_${user.id_user}`, tempProfileImage);
    setProfileImage(tempProfileImage);
    setTempProfileImage(null);
    setImageChanged(false);
    window.dispatchEvent(new Event("profile-updated"));
  };

  const handleDeleteImage = () => {
    if (!user) return;
    localStorage.removeItem(`profile_image_${user.id_user}`);
    setProfileImage(null);
    window.dispatchEvent(new Event("profile-updated"));
  };

  const dashboardLink =
    user?.role.toUpperCase() === "ORGANIZER"
      ? "/organizer/dashboard"
      : "/student/dashboard";

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 text-[#a78bfa] animate-spin" />
      </div>
    );

  if (error || !user)
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-white">
        <div className="text-center p-10 bg-[#151632] border border-red-500/30 rounded-2xl shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2>{error || "Eroare profil"}</h2>
          <Link to="/" className="mt-6 inline-block text-[#a78bfa]">
            Înapoi
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 font-sans animate-fade-in relative">
      <AnimatedBackground />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Profilul Meu
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Gestionați informațiile contului dvs.
            </p>
          </div>
          <Link
            to={dashboardLink}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
          >
            <ArrowLeft size={14} /> <span>Înapoi</span>
          </Link>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center gap-3">
            <Check size={20} /> Profil actualizat!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* AVATAR */}
          <div className="lg:col-span-4">
            <div className="bg-[#151632] rounded-3xl border border-slate-800 p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#a78bfa]/10 to-transparent"></div>
              <div className="relative mb-6">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl border-4 border-[#1E1E40] overflow-hidden ${
                    !(tempProfileImage || profileImage)
                      ? "bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white"
                      : ""
                  }`}
                >
                  {tempProfileImage || profileImage ? (
                    <img
                      src={(tempProfileImage || profileImage)!}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <span>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2.5 bg-[#a78bfa] text-white rounded-full border-4 border-[#151632] transition-transform hover:scale-110"
                >
                  <Camera size={16} />
                </button>
                {profileImage && !tempProfileImage && (
                  <button
                    onClick={handleDeleteImage}
                    className="absolute top-1 right-1 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full border-2 border-[#151632] transition-transform hover:scale-110"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {imageChanged && (
                <div className="flex gap-2 mb-4 animate-in fade-in zoom-in">
                  <button
                    onClick={handleSaveImage}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Check size={12} /> Salvează
                  </button>
                  <button
                    onClick={() => {
                      setTempProfileImage(null);
                      setImageChanged(false);
                    }}
                    className="px-4 py-1.5 bg-red-500/20 text-red-300 rounded-lg text-xs font-bold"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <h2 className="text-2xl font-bold text-white mb-1 truncate w-full uni-title">
                {isEditing
                  ? `${editForm.firstName} ${editForm.lastName}`
                  : `${user.firstName} ${user.lastName}`}
              </h2>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase">
                {user.role}
              </span>
            </div>
          </div>

          {/* DETALII */}
          <div className="lg:col-span-8">
            <div className="bg-[#151632] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-[#1E1E40]/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User size={20} className="text-[#a78bfa]" /> Informații
                  Personale
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#a78bfa] text-sm flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Edit2 size={16} /> Editează
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-slate-400 text-sm"
                    >
                      Anulează
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-[#a78bfa] px-4 py-1.5 rounded-lg text-sm font-bold text-white flex items-center gap-2 transition-all"
                    >
                      {isSaving ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}{" "}
                      Salvează
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Prenume
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full bg-[#0F1023] border border-slate-700 rounded-xl px-4 py-2.5 text-white mt-2"
                      />
                    ) : (
                      <p className="text-lg text-white mt-1 font-medium">
                        {user.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Nume
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="w-full bg-[#0F1023] border border-slate-700 rounded-xl px-4 py-2.5 text-white mt-2"
                      />
                    ) : (
                      <p className="text-lg text-white mt-1 font-medium">
                        {user.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="flex items-center gap-3 text-white/60 bg-[#0F1023]/50 p-3 rounded-xl border border-white/5 mt-2">
                    <Mail size={18} /> {user.email}
                  </div>
                </div>

                {/* SECȚIUNEA DINAMICĂ STUDENT */}
                {user.role.toUpperCase() === "STUDENT" && (
                  <div className="pt-6 border-t border-slate-800">
                    <h4 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <GraduationCap size={18} /> Detalii Academice
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1E1E40]/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500">
                          Facultate
                        </span>
                        <p className="text-white font-medium mt-1">
                          {getFacultyDisplayName()}
                        </p>
                      </div>
                      <div className="p-4 bg-[#1E1E40]/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500">
                          Specializare
                        </span>
                        <p className="text-white font-medium mt-1">
                          {getSpecDisplayName()}
                        </p>
                      </div>
                      <div className="p-4 bg-[#1E1E40]/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500">
                          An de studiu
                        </span>
                        <p className="text-white font-medium mt-1">
                          {user.study_year || "Nesetat"}
                        </p>
                      </div>
                      <div className="p-4 bg-[#1E1E40]/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500">
                          Ciclu studii
                        </span>
                        <p className="text-white font-medium mt-1">
                          {user.study_cycle || "Nesetat"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECȚIUNEA DINAMICĂ ORGANIZATOR */}
                {user.role.toUpperCase() === "ORGANIZER" && (
                  <div className="pt-6 border-t border-slate-800">
                    <h4 className="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2">
                      <Building2 size={18} /> Detalii Organizație
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1E1E40]/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500">
                          Nume Organizație
                        </span>
                        <p className="text-white font-medium mt-1">
                          {user.organization_name || "Nespecificat"}
                        </p>
                      </div>
                      <div className="p-4 bg-[#1E1E40]/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500">Tip</span>
                        <p className="text-white font-medium mt-1">
                          {user.organization_type || "Nespecificat"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
