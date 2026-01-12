import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  BarChart3, 
  Megaphone, 
  Settings,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';

const OrganizersInfoPage: React.FC = () => {
  const features = [
    {
      icon: <Calendar size={24} />,
      title: 'Creare Evenimente Rapidă',
      description: 'Creează evenimente profesionale în câteva minute cu editorul nostru intuitiv și template-uri predefinite.'
    },
    {
      icon: <Users size={24} />,
      title: 'Gestionare Participanți',
      description: 'Monitorizează înscrisele, trimite mesaje în masă și gestionează lista de așteptare cu ușurință.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Statistici Detaliate',
      description: 'Analizează performanța evenimentelor cu rapoarte detaliate și metrici de engagement.'
    },
    {
      icon: <Megaphone size={24} />,
      title: 'Promovare Eficientă',
      description: 'Ajunge la mii de studenți prin notificări push, email marketing și rețele sociale integrate.'
    },
    {
      icon: <Settings size={24} />,
      title: 'Personalizare Completă',
      description: 'Customizează paginile de eveniment, formularele de înscriere și comunicările.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Automatizări',
      description: 'Setează remindere automate, confirmări instant și fluxuri de comunicare predefinite.'
    }
  ];

  const benefits = [
    'Dashboard complet pentru gestionare evenimente',
    'Rapoarte și analize în timp real',
    'Comunicare directă cu participanții',
    'Export date în format CSV/Excel',
    'Suport tehnic dedicat',
    'Integrare cu calendar Google/Outlook'
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] mb-6">
            <Briefcase size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pentru Organizatori
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Instrumentele de care ai nevoie pentru a crea, promova și gestiona evenimente de succes în comunitatea universitară.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-[#111427]/60 backdrop-blur-md rounded-2xl border border-[#a78bfa]/15 p-6 transition-all duration-300 hover:border-[#a78bfa]/40 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(139,92,246,0.2)] overflow-hidden"
            >
              {/* Top gradient line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a78bfa]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon with glow effect */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a78bfa]/20 to-[#7c3aed]/10 flex items-center justify-center text-[#a78bfa] mb-5 group-hover:scale-105 transition-transform duration-300 relative">
                <div className="absolute inset-0 rounded-xl bg-[#a78bfa]/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                <span className="relative z-10">{feature.icon}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#c4b5fd] transition-colors duration-300">{feature.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#1a1040]/40 backdrop-blur-sm rounded-2xl border border-[#a78bfa]/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">De ce să alegi UNIfy?</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#a78bfa]/20 to-[#7c3aed]/20 backdrop-blur-sm rounded-2xl border border-[#a78bfa]/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Începe gratuit</h2>
            <p className="text-white/70 mb-6">
              Creează un cont de organizator și începe să publici evenimente în câteva minute. Fără costuri ascunse, fără comisioane.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle size={16} className="text-[#a78bfa]" />
                <span className="text-sm">Verificare rapidă a contului</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle size={16} className="text-[#a78bfa]" />
                <span className="text-sm">Acces complet la toate funcționalitățile</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle size={16} className="text-[#a78bfa]" />
                <span className="text-sm">Suport tehnic inclus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-[#1a1040]/40 backdrop-blur-sm rounded-2xl border border-[#a78bfa]/20 p-8 mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Procesul de aprobare</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-white mb-2">Înregistrare</h3>
              <p className="text-white/60 text-sm">Completează formularul cu datele organizației</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-white mb-2">Verificare</h3>
              <p className="text-white/60 text-sm">Echipa noastră verifică datele în 24-48h</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-white mb-2">Aprobare</h3>
              <p className="text-white/60 text-sm">Primești acces complet la dashboard</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-white mb-2">Publicare</h3>
              <p className="text-white/60 text-sm">Creează și publică primul tău eveniment</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Gata să organizezi evenimente?</h2>
          <p className="text-white/60 mb-6">Alătură-te comunității de organizatori și ajunge la mii de studenți.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f] font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
            >
              Devino organizator
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#a78bfa]/30 text-white font-semibold rounded-xl hover:bg-[#a78bfa]/10 transition-all"
            >
              Am deja cont
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizersInfoPage;
