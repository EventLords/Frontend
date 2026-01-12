import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Save
} from 'lucide-react';

const AdminSettingsPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoApproveEvents, setAutoApproveEvents] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);

  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'UNIfy',
    contactEmail: 'admin@unify.ro',
    maxEventsPerOrganizer: 10,
    maxParticipantsPerEvent: 500,
  });

  const handleSaveSettings = () => {
    console.log('Saving settings...', platformSettings);
  };

  const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed]' : 'bg-white/20'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="text-white max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Setări Platformă</h1>
        <p className="text-white/60">Configurează setările generale ale platformei UNIfy</p>
      </div>

      {/* General Settings */}
      <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#a78bfa]/20">
            <Settings size={20} className="text-[#a78bfa]" />
          </div>
          <h2 className="text-lg font-semibold">Setări Generale</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Numele Platformei</label>
            <input
              type="text"
              value={platformSettings.siteName}
              onChange={(e) => setPlatformSettings({ ...platformSettings, siteName: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#a78bfa]/50"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Email Contact Administrator</label>
            <input
              type="email"
              value={platformSettings.contactEmail}
              onChange={(e) => setPlatformSettings({ ...platformSettings, contactEmail: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#a78bfa]/50"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Max Evenimente / Organizator</label>
              <input
                type="number"
                value={platformSettings.maxEventsPerOrganizer}
                onChange={(e) => setPlatformSettings({ ...platformSettings, maxEventsPerOrganizer: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#a78bfa]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Max Participanți / Eveniment</label>
              <input
                type="number"
                value={platformSettings.maxParticipantsPerEvent}
                onChange={(e) => setPlatformSettings({ ...platformSettings, maxParticipantsPerEvent: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#a78bfa]/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#a78bfa]/20">
            <Bell size={20} className="text-[#a78bfa]" />
          </div>
          <h2 className="text-lg font-semibold">Notificări</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="font-medium text-white">Notificări Email</p>
              <p className="text-sm text-white/50">Primește notificări prin email pentru cereri noi</p>
            </div>
            <Toggle enabled={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#a78bfa]/20">
            <Shield size={20} className="text-[#a78bfa]" />
          </div>
          <h2 className="text-lg font-semibold">Securitate</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="font-medium text-white">Verificare Email Obligatorie</p>
              <p className="text-sm text-white/50">Utilizatorii trebuie să verifice emailul la înregistrare</p>
            </div>
            <Toggle enabled={requireEmailVerification} onChange={() => setRequireEmailVerification(!requireEmailVerification)} />
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="font-medium text-white">Auto-aprobare Evenimente</p>
              <p className="text-sm text-white/50">Aprobă automat evenimentele de la organizatori verificați</p>
            </div>
            <Toggle enabled={autoApproveEvents} onChange={() => setAutoApproveEvents(!autoApproveEvents)} />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#a78bfa]/20">
            <Database size={20} className="text-[#a78bfa]" />
          </div>
          <h2 className="text-lg font-semibold">Sistem</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="font-medium text-white">Mod Mentenanță</p>
              <p className="text-sm text-white/50">Dezactivează accesul utilizatorilor pe platformă</p>
            </div>
            <Toggle enabled={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
          </div>
        </div>

        {maintenanceMode && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-400 text-sm">
              ⚠️ Modul mentenanță este activ. Utilizatorii nu pot accesa platforma.
            </p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#a78bfa]/25 transition-all"
        >
          <Save size={18} />
          Salvează Setările
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
