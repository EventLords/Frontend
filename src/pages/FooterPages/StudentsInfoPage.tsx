import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Calendar, 
  Bell, 
  Search, 
  CheckCircle, 
  Star,
  ArrowRight,
  Filter,
  Loader
} from 'lucide-react';
import { studentEventsService } from '../../features/students/services/eventsService';

interface StatItem {
  value: string;
  label: string;
}

const StudentsInfoPage: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { value: "...", label: "Evenimente în platformă" },
    { value: "...", label: "Studenți participanți" },
    { value: "...", label: "Organizatori activi" },
    { value: "...", label: "Facultăți conectate" },
  ]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const events = await studentEventsService.getAllEvents({ period: "all" });

        const totalEvents = events.length;
        const uniqueOrganizers = new Set(events.map((e) => e.organizer.name)).size;
        const uniqueFaculties = new Set(events.map((e) => e.faculty).filter(Boolean)).size;
        const totalParticipants = events.reduce((acc, curr) => acc + curr.currentParticipants, 0);

        const formatNumber = (num: number) => {
          if (num === 0) return "0";
          if (num < 10) return `${num}`;
          if (num < 50) return `${Math.floor(num / 5) * 5}+`;
          if (num < 100) return `${Math.floor(num / 10) * 10}+`;
          if (num < 1000) return `${Math.floor(num / 50) * 50}+`;
          return `${(num / 1000).toFixed(1)}K+`;
        };

        setStats([
          { value: formatNumber(totalEvents), label: "Evenimente în platformă" },
          { value: formatNumber(totalParticipants), label: "Studenți participanți" },
          { value: formatNumber(uniqueOrganizers), label: "Organizatori activi" },
          { value: formatNumber(uniqueFaculties || 5), label: "Facultăți conectate" },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats", error);
        setStats([
          { value: "50+", label: "Evenimente în platformă" },
          { value: "500+", label: "Studenți participanți" },
          { value: "10+", label: "Organizatori activi" },
          { value: "5+", label: "Facultăți conectate" },
        ]);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);
  const features = [
    {
      icon: <Search size={24} />,
      title: 'Descoperă Evenimente',
      description: 'Explorează sute de evenimente universitare organizate de facultăți, cluburi studențești și organizații partenere.'
    },
    {
      icon: <Filter size={24} />,
      title: 'Filtrare Avansată',
      description: 'Găsește rapid evenimentele care te interesează folosind filtre după categorie, dată, locație și organizator.'
    },
    {
      icon: <Bell size={24} />,
      title: 'Notificări Personalizate',
      description: 'Primește alerte pentru evenimentele din domeniile tale de interes și remindere înainte de începerea acestora.'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Calendar Personal',
      description: 'Vizualizează toate evenimentele la care te-ai înscris într-un calendar personal sincronizat.'
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Înscriere Simplă',
      description: 'Înscrie-te la evenimente cu un singur click și primește confirmarea instant pe email.'
    },
    {
      icon: <Star size={24} />,
      title: 'Evaluări și Recenzii',
      description: 'Descoperă cele mai apreciate evenimente pe baza recenziilor altor studenți.'
    }
  ];

  const steps = [
    { step: '1', title: 'Creează-ți cont', description: 'Înregistrează-te gratuit cu emailul universitar' },
    { step: '2', title: 'Explorează', description: 'Descoperă evenimente din toate categoriile' },
    { step: '3', title: 'Înscrie-te', description: 'Selectează evenimentele care te interesează' },
    { step: '4', title: 'Participă', description: 'Primește notificări și participă la evenimente' }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] mb-6">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pentru Studenți
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Descoperă, participă și conectează-te la cele mai relevante evenimente universitare pentru dezvoltarea ta personală și profesională.
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

        {/* How It Works */}
        <div className="bg-[#1a1040]/40 backdrop-blur-sm rounded-2xl border border-[#a78bfa]/20 p-8 mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Cum funcționează?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1a1040]/60 backdrop-blur-sm rounded-xl border border-[#a78bfa]/20 p-6 text-center">
              {isLoadingStats ? (
                <Loader size={24} className="text-[#a78bfa] animate-spin mx-auto mb-2" />
              ) : (
                <p className="text-3xl font-bold text-[#a78bfa]">{stat.value}</p>
              )}
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Gata să începi?</h2>
          <p className="text-white/60 mb-6">Creează-ți contul gratuit și nu mai rata niciun eveniment important.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f] font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
            >
              Creează cont gratuit
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#a78bfa]/30 text-white font-semibold rounded-xl hover:bg-[#a78bfa]/10 transition-all"
            >
              Explorează evenimente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsInfoPage;
