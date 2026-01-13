import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Filter,
  Bell,
  CheckCircle,
  Calendar,
  Users,
  BarChart3,
  FileCheck,
  Shield,
  MapPin
} from 'lucide-react';

// Import local event images
import eventImage1 from '../../assets/events/image_ev1.png';
import eventImage2 from '../../assets/events/image_ev2.png';
import eventImage3 from '../../assets/events/image_ev3.png';

/* ===========================================
   HERO SECTION
=========================================== */
const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[520px] flex items-center justify-center bg-gradient-to-b from-[#DFF3E4] via-[#c4d4f4] to-[#7B6DB5] pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a4e] mb-5 leading-tight">
          Evenimente universitare
          <br />
          <span className="text-[#3F3176]">într-un singur loc</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Descoperă, organizează și participă la evenimente care îți 
          modelează viitorul
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link 
            to="/evenimente"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#1a1a4e] text-white font-medium rounded-full border border-[#1a1a4e] hover:bg-transparent hover:text-[#1a1a4e] transition-all shadow-md hover:shadow-lg"
          >
            Vezi evenimente
            <ArrowRight size={18} />
          </Link>
          <Link 
            to="/despre-noi"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#E8F1ED] text-[#1a1a4e] font-medium rounded-full border border-[#1a1a4e]/15 hover:bg-[#d8ebe0] hover:border-[#1a1a4e]/30 transition-all"
          >
            Află mai multe
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ===========================================
   BENEFITS SECTION
=========================================== */
interface BenefitCardProps {
  title: string;
  description: string;
  features: { icon: React.ReactNode; text: string }[];
  accentColor: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ title, description, features, accentColor }) => {
  return (
    <div className="bg-[#E8F1ED] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className={`font-semibold text-base mb-2 ${accentColor}`}>
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {description}
      </p>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-[#3F3176]">{feature.icon}</span>
            {feature.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: 'Pentru studenți',
      accentColor: 'text-blue-600',
      description: 'Descoperă evenimentele relevante pentru tine și cariera ta viitoare. Participă cu ușurință și primește toate detaliile digitale.',
      features: [
        { icon: <Filter size={16} />, text: 'Filtrare avansată' },
        { icon: <Bell size={16} />, text: 'Alerte digitalizate' },
        { icon: <CheckCircle size={16} />, text: 'Notificări personalizate' },
      ],
    },
    {
      title: 'Pentru organizatori',
      accentColor: 'text-purple-600',
      description: 'Creează și gestionează evenimente profesionale în câțiva pași simpli. Monitorizează participanții și promovează eficient.',
      features: [
        { icon: <Calendar size={16} />, text: 'Dashboard complet' },
        { icon: <Users size={16} />, text: 'Gestionare participanți' },
        { icon: <BarChart3 size={16} />, text: 'Statistici detaliate' },
      ],
    },
    {
      title: 'Pentru administratori',
      accentColor: 'text-indigo-600',
      description: 'Controlează tot ce se întâmplă pe platformă. Validează conturi și evenimente pentru o experiență sigură pentru toți utilizatorii.',
      features: [
        { icon: <FileCheck size={16} />, text: 'Rapoarte complete' },
        { icon: <Shield size={16} />, text: 'Aprobare evenimente' },
        { icon: <BarChart3 size={16} />, text: 'Analize în timp real' },
      ],
    },
  ];

  return (
    <section className="py-14 bg-gradient-to-b from-[#7B6DB5] to-[#5a4d8a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
            Beneficii pentru toți
          </h2>
          <p className="text-base text-white/80 max-w-2xl mx-auto">
            O platformă care conectează comunitatea universitară
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===========================================
   POPULAR EVENTS SECTION
=========================================== */
interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  organizer: string;
  imageUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  title, 
  date, 
  time, 
  location, 
  participants, 
  organizer,
  imageUrl 
}) => {
  return (
    <div className="bg-[#E7EEF9] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group h-full flex flex-col"> 
      {/* NOU: h-full și flex flex-col pe cardul exterior */}
      
      {/* Event Image */}
      <div className="h-40 relative overflow-hidden rounded-t-2xl shrink-0">
        {/* shrink-0 asigură că imaginea nu este micșorată de flex-col */}
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
            <Calendar className="text-white/40" size={40} />
          </div>
        )}
      </div>
      
      {/* Event Content - NOU: flex-grow pentru a ocupa tot spațiul */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow"> {/* NOU: Acest div preia spațiul variabil */}
          <h3 className="font-semibold text-[#1a1a4e] text-base mb-2 group-hover:text-[#3F3176] transition-colors line-clamp-2">
            {title}
          </h3>
          
          <div className="space-y-1.5 text-sm text-gray-600 mb-3">
            {/* ... (Meta Info rămâne neschimbat) ... */}
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-[#3F3176]" />
              <span>{date} · {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#3F3176]" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={13} className="text-[#3F3176]" />
            <span>{participants} participanți</span>
          </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-3">
            Organizat de: <span className="text-[#3F3176] font-medium">{organizer}</span>
          </p>
        </div> {/* End flex-grow */}
        
        {/* Butonul CTA - Rămâne fix la baza containerului flex-col */}
        <button className="w-full py-2 border border-[#1a1a4e] text-[#1a1a4e] font-medium rounded-full text-sm hover:bg-[#1a1a4e] hover:text-white transition-all shrink-0">
          Vezi detalii
        </button>
      </div>
    </div>
  );
};

const PopularEventsSection: React.FC = () => {
  const events = [
    {
      title: 'Conferință tehnologie și inovare',
      date: '20.03.2024',
      time: '10:00',
      location: 'Amfiteatrul NB',
      participants: 120,
      organizer: 'Departamentul IT',
      imageUrl: eventImage1,
    },
    {
      title: 'Hackathon Universitar 2025',
      date: '25.03.2024',
      time: '10:00',
      location: 'Amfiteatrul RR',
      participants: 80,
      organizer: 'FIRESC',
      imageUrl: eventImage2,
    },
    {
      title: 'Workshop dezvoltare web',
      date: '27.03.2024',
      time: '10:00',
      location: 'Amfiteatrul DH',
      participants: 150,
      organizer: 'Tech Club',
      imageUrl: eventImage3,
    },
  ];

  return (
    <section className="py-14 bg-[#C8DDD0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-5">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/evenimente"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent border border-[#1a1a4e] text-[#1a1a4e] font-medium rounded-full hover:bg-[#1a1a4e] hover:text-white transition-all text-sm"
          >
            Vezi toate evenimentele
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ===========================================
   CTA SECTION (Începe astăzi)
=========================================== */
const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#3F3176] to-[#171738]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-4">
          Începe astăzi
        </h2>
        <p className="text-base md:text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Alătură-te comunității și nu rata niciun eveniment important din 
          viața universitară
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link 
            to="/inregistrare"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#E8F1ED] text-[#1a1a4e] font-medium rounded-full hover:bg-[#d8ebe0] transition-all shadow-sm hover:shadow-md"
          >
            Creează cont
          </Link>
          <Link 
            to="/evenimente"
            className="inline-flex items-center gap-2 px-7 py-3 border border-white text-white font-medium rounded-full hover:bg-white/10 transition-all"
          >
            Explorează evenimente
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ===========================================
   MAIN HOMEPAGE COMPONENT
=========================================== */
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <PopularEventsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
