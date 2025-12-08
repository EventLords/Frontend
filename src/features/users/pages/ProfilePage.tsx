import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Mail, Shield, Edit2, Check, X, Camera, ArrowLeft } from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'organizer' | 'admin';
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  // Detect if user is organizer or student based on current URL
  const location = useLocation();
  const isOrganizer = location.pathname.startsWith('/organizer');

  // Mock user data - in real app, get from auth context
  const [user, setUser] = useState<UserProfile>({
    firstName: isOrganizer ? 'Emma' : 'Alexandru',
    lastName: 'Popescu',
    email: isOrganizer ? 'emma.popescu@usv.ro' : 'alexandru.popescu@student.usv.ro',
    role: isOrganizer ? 'organizer' : 'student',
    createdAt: '2024-01-15'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Generate initials for avatar
  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Generate pastel color based on name
  const generateColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return {
      bg: `hsl(${hue}, 70%, 80%)`,
      text: `hsl(${hue}, 70%, 25%)`
    };
  };

  const avatarColors = generateColor(user.firstName + user.lastName);

  const getRoleLabel = (role: UserProfile['role']) => {
    switch (role) {
      case 'student': return 'Student';
      case 'organizer': return 'Organizator';
      case 'admin': return 'Administrator';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: UserProfile['role']) => {
    switch (role) {
      case 'student': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'organizer': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleEdit = () => {
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName
    });
  };

  const handleSave = async () => {
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setUser(prev => ({
      ...prev,
      firstName: editForm.firstName.trim(),
      lastName: editForm.lastName.trim()
    }));
    
    setIsEditing(false);
    setIsSaving(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const dashboardPath = isOrganizer ? '/organizer/dashboard' : '/student/dashboard';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to={dashboardPath}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Înapoi la Dashboard</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Profilul meu
        </h1>
        <p className="text-white/60">
          Gestionează informațiile contului tău
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
          <Check size={20} className="text-green-400" />
          <span className="text-green-400 text-sm font-medium">
            Profilul a fost actualizat cu succes!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg"
                style={{
                  backgroundColor: avatarColors.bg,
                  color: avatarColors.text
                }}
              >
                {getInitials()}
              </div>
              <button
                className="absolute bottom-0 right-0 p-2 bg-[#4ECDC4] text-white rounded-full shadow-lg hover:bg-[#3dbdb5] transition-colors"
                title="Schimbă avatarul"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Name */}
            <h2 className="text-xl font-bold text-white mb-1">
              {user.firstName} {user.lastName}
            </h2>

            {/* Role Badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
              <Shield size={14} />
              {getRoleLabel(user.role)}
            </span>

            {/* Member Since */}
            <p className="text-sm text-white/40 mt-4">
              Membru din {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">
                Informații personale
              </h3>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#4ECDC4] hover:bg-[#4ECDC4]/10 rounded-lg transition-colors"
                >
                  <Edit2 size={14} />
                  Editează
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={14} />
                    Anulează
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3dbdb5] transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Salvare...
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        Salvează
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-6">
              {/* First Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                  <User size={14} />
                  Prenume
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#4ECDC4]/50 transition-colors"
                    placeholder="Introduceți prenumele"
                  />
                ) : (
                  <p className="text-white text-lg">{user.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                  <User size={14} />
                  Nume
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#4ECDC4]/50 transition-colors"
                    placeholder="Introduceți numele"
                  />
                ) : (
                  <p className="text-white text-lg">{user.lastName}</p>
                )}
              </div>

              {/* Email - Read Only */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                  <Mail size={14} />
                  Email
                </label>
                <p className="text-white text-lg">{user.email}</p>
                <p className="text-xs text-white/40 mt-1">
                  Email-ul nu poate fi modificat
                </p>
              </div>

              {/* Role - Read Only */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                  <Shield size={14} />
                  Rol
                </label>
                <p className="text-white text-lg">{getRoleLabel(user.role)}</p>
                <p className="text-xs text-white/40 mt-1">
                  Rolul este atribuit de administrator
                </p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="mt-6 bg-gradient-to-r from-[#4ECDC4]/20 to-purple-500/20 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Activitate</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-xs text-white/60">Evenimente</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-xs text-white/60">Participări</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">48h</p>
                <p className="text-xs text-white/60">Total ore</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs text-white/60">Certificate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
