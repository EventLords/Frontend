import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Filter,
  Bell,
  CheckCircle,
  Calendar,
  Users,
  BarChart3,
  MapPin,
  Sparkles,
  GraduationCap,
  Briefcase,
  Loader,
} from "lucide-react";
import "./HomePage.css";

// Import service to fetch real data
import { studentEventsService } from "../../features/students/services/eventsService";
import { StudentEvent } from "../../types/student";

// Keep local assets as fallbacks or for other sections if needed

/* ===========================================
   HERO SECTION
=========================================== */
const HeroSection: React.FC = () => {
  return (
    <section className="home-hero">
      <div className="home-hero-content">
        <h1 className="home-hero-title">
          Evenimente universitare
          <br />
          <span className="home-hero-title-accent">într-un singur loc</span>
        </h1>
        <p className="home-hero-subtitle">
          Descoperă, organizează și participă la evenimente care îți modelează
          viitorul
        </p>
        <div className="home-hero-buttons">
          <Link to="/events" className="home-btn-primary">
            Vezi evenimente
            <ArrowRight size={18} />
          </Link>
          <Link to="/about" className="home-btn-secondary">
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

const BenefitCard: React.FC<
  BenefitCardProps & { icon: React.ReactNode; linkTo: string }
> = ({ title, description, features, accentColor, icon, linkTo }) => {
  return (
    <Link to={linkTo} className="home-benefit-card group">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            accentColor === "text-blue-600"
              ? "bg-blue-500/20"
              : "bg-purple-500/20"
          }`}
        >
          {icon}
        </div>
        <h3 className={`home-benefit-card-title ${accentColor}`}>{title}</h3>
      </div>
      <p className="home-benefit-card-desc">{description}</p>
      <ul className="home-benefit-card-features">
        {features.map((feature, idx) => (
          <li key={idx} className="home-benefit-card-feature">
            {feature.icon}
            {feature.text}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#a78bfa] group-hover:gap-3 transition-all">
        Află mai multe <ArrowRight size={16} />
      </div>
    </Link>
  );
};

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: "Pentru studenți",
      accentColor: "text-blue-600",
      icon: <GraduationCap size={24} className="text-blue-400" />,
      linkTo: "/students",
      description:
        "Descoperă evenimentele relevante pentru tine și cariera ta viitoare. Participă cu ușurință și primește toate detaliile digitale.",
      features: [
        { icon: <Filter size={16} />, text: "Filtrare avansată" },
        { icon: <Bell size={16} />, text: "Alerte digitalizate" },
        { icon: <CheckCircle size={16} />, text: "Notificări personalizate" },
      ],
    },
    {
      title: "Pentru organizatori",
      accentColor: "text-purple-600",
      icon: <Briefcase size={24} className="text-purple-400" />,
      linkTo: "/organizers",
      description:
        "Creează și gestionează evenimente profesionale în câțiva pași simpli. Monitorizează participanții și promovează eficient.",
      features: [
        { icon: <Calendar size={16} />, text: "Dashboard complet" },
        { icon: <Users size={16} />, text: "Gestionare participanți" },
        { icon: <BarChart3 size={16} />, text: "Statistici detaliate" },
      ],
    },
  ];

  return (
    <section className="home-benefits">
      <div className="home-benefits-container">
        <div className="home-benefits-header">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={20} className="text-[#a78bfa]" />
            <span className="text-sm font-medium text-[#a78bfa] uppercase tracking-wider">
              Beneficii
            </span>
          </div>
          <h2 className="home-benefits-title">O platformă pentru toți</h2>
          <p className="home-benefits-subtitle">
            Conectează comunitatea universitară prin evenimente memorabile
          </p>
        </div>

        <div className="home-benefits-grid-centered">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===========================================
   POPULAR EVENTS SECTION (FETCHED FROM API)
=========================================== */
interface EventCardProps {
  id: string;
  title: string;
  date: string; // Pre-formatted as DD.MM.YYYY • HH:mm
  location: string;
  participants: number;
  maxParticipants: number;
  organizer: string;
  imageUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  location,
  participants,
  maxParticipants,
  organizer,
  imageUrl,
}) => {
  return (
    <div className="home-event-card">
      <div className="home-event-card-image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/events/default.png";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 flex items-center justify-center">
            <Calendar className="text-white/40" size={40} />
          </div>
        )}
      </div>

      <div className="home-event-card-content">
        <h3 className="home-event-card-title">{title}</h3>

        <div className="home-event-card-info">
          <div className="home-event-card-info-item">
            <Calendar size={13} />
            <span>{date}</span>
          </div>
          <div className="home-event-card-info-item">
            <MapPin size={13} />
            <span>{location}</span>
          </div>
          <div className="home-event-card-info-item">
            <Users size={13} />
            <span>
              {participants} / {maxParticipants} participanți
            </span>
          </div>
        </div>

        <p className="home-event-card-organizer">
          Organizat de: <span>{organizer}</span>
        </p>

        <Link
          to={`/login?redirect=/student/events/${id}`}
          className="home-event-card-btn"
        >
          Vezi detalii
        </Link>
      </div>
    </div>
  );
};

const PopularEventsSection: React.FC = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events from service
        // Assuming getAllEvents can be called without auth, or returns public events
        // If your API requires auth for everything, this might return 401.
        // Ideally, have a public endpoint like /api/events/public
        const data = await studentEventsService.getAllEvents({
          period: "upcoming",
        });

        // Map API response (StudentEvent[]) to EventCardProps
        const mappedEvents = data.slice(0, 3).map((e: StudentEvent) => {
          // Format date as DD.MM.YYYY • HH:mm
          const dateObj = new Date(e.date);
          const day = dateObj.getDate().toString().padStart(2, "0");
          const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
          const year = dateObj.getFullYear();
          const time = e.time ? e.time.substring(0, 5) : "00:00";
          const formattedDate = `${day}.${month}.${year} • ${time}`;
          
          return {
            id: e.id,
            title: e.name,
            date: formattedDate,
            location: e.location,
            participants: e.currentParticipants,
            maxParticipants: e.maxParticipants,
            organizer: e.organizer.name,
            imageUrl: e.image,
          };
        });

        setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to fetch homepage events:", err);
        // Fallback to empty or specific error state if critical,
        // but for homepage maybe just show nothing or a message
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="home-events">
        <div className="home-events-container flex justify-center py-20">
          <Loader className="w-10 h-10 text-[#a78bfa] animate-spin" />
        </div>
      </section>
    );
  }

  // If no events found or error, you might want to show nothing or a placeholder
  if (events.length === 0) {
    return null; // Or render a "Coming Soon" section
  }

  return (
    <section className="home-events">
      <div className="home-events-container">
        <div className="home-benefits-header mb-10">
          <h2 className="home-benefits-title">Evenimente Populare</h2>
          <p className="home-benefits-subtitle">Vezi ce urmează în campus</p>
        </div>

        <div className="home-events-grid">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        <div className="home-events-cta">
          <Link to="/events" className="home-btn-secondary">
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
    <section className="home-cta">
      <div className="home-cta-container">
        <h2 className="home-cta-title">Începe astăzi</h2>
        <p className="home-cta-subtitle">
          Alătură-te comunității și nu rata niciun eveniment important din viața
          universitară
        </p>
        <div className="home-cta-buttons">
          <Link to="/register" className="home-btn-primary">
            Creează cont
          </Link>
          <Link to="/events" className="home-btn-secondary">
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
    <>
      <HeroSection />
      <BenefitsSection />
      <PopularEventsSection />
      <CTASection />
    </>
  );
};

export default HomePage;
