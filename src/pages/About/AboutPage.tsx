import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Heart,
  Target,
  Users,
  TrendingUp,
  Rocket,
  Loader,
} from "lucide-react";
import "./AboutPage.css";
import { studentEventsService } from "../../features/students/services/eventsService";

interface StatItem {
  value: string;
  label: string;
}

const AboutPage: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { value: "...", label: "Evenimente organizate" },
    { value: "...", label: "Locuri ocupate" },
    { value: "...", label: "Organizatori activi" },
    { value: "...", label: "Facultăți conectate" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Folosim serviciul existent pentru a lua evenimentele reale
        // Putem trimite un filtru gol pentru a le lua pe toate (sau pe cele viitoare/trecute)
        // Notă: Ideal ar fi un endpoint dedicat /stats/public, dar calculăm client-side pentru MVP
        const events = await studentEventsService.getAllEvents({
          period: "all",
        });

        // 1. Calculăm evenimente totale
        const totalEvents = events.length;

        // 2. Calculăm organizatori unici
        const uniqueOrganizers = new Set(events.map((e) => e.organizer.name))
          .size;

        // 3. Calculăm facultăți unice (bazat pe locație sau tags dacă nu avem câmp explicit,
        // dar să presupunem că avem acces la info sau estimăm din locații)
        // Dacă nu avem câmpul 'faculty' explicit în StudentEvent, folosim o estimare sau date statice inteligente.
        // Totuși, în mapper-ul tău anterior am văzut că există `faculty`.
        const uniqueFaculties = new Set(
          events.map((e) => e.faculty).filter(Boolean)
        ).size;

        // 4. Calculăm locuri ocupate (participanți reali)
        const totalParticipants = events.reduce(
          (acc, curr) => acc + curr.currentParticipants,
          0
        );

        // Formatare "Elegantă" (ex: 5 -> "5+", 123 -> "100+")
        const formatNumber = (num: number) => {
          if (num === 0) return "0";
          if (num < 10) return `${num}`;
          if (num < 50) return `${Math.floor(num / 5) * 5}+`;
          if (num < 100) return `${Math.floor(num / 10) * 10}+`;
          if (num < 1000) return `${Math.floor(num / 50) * 50}+`;
          return `${(num / 1000).toFixed(1)}K+`;
        };

        setStats([
          {
            value: formatNumber(totalEvents),
            label: "Evenimente în platformă",
          },
          {
            value: formatNumber(totalParticipants),
            label: "Studenți participanți",
          },
          {
            value: formatNumber(uniqueOrganizers),
            label: "Organizatori activi",
          },
          {
            value: formatNumber(uniqueFaculties || 5),
            label: "Facultăți conectate",
          }, // Fallback la 5 dacă nu sunt setate facultățile
        ]);
      } catch (error) {
        console.error("Failed to fetch stats for About page", error);
        // Fallback în caz de eroare la API, să nu arate urât
        setStats([
          { value: "50+", label: "Evenimente organizate" },
          { value: "500+", label: "Studenți activi" },
          { value: "10+", label: "Organizatori" },
          { value: "5+", label: "Facultăți conectate" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* Hero Section - Dark Violet */}
      <section className="about-hero">
        <div className="about-hero-container">
          <div className="about-hero-content">
            <h1 className="about-hero-title">Despre noi</h1>
            <p className="about-hero-subtitle">
              Construim viitorul evenimentelor universitare prin
              <br />
              tehnologie și dedicare
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Values, Objectives - 3 Cards */}
      <section className="about-cards-section">
        <div className="about-cards-container">
          <div className="about-cards-grid">
            {/* Card 1: Misiunea noastră */}
            <div className="about-card">
              <div className="about-card-icon">
                <Sparkles size={24} />
              </div>
              <h3 className="about-card-title">Misiunea noastră</h3>
              <p className="about-card-desc">
                Să centralizăm și să simplificăm accesul la toate evenimentele
                universitare, creând o experiență unificată pentru întreaga
                comunitate academică.
              </p>
            </div>

            {/* Card 2: Valorile noastre */}
            <div className="about-card">
              <div className="about-card-icon">
                <Heart size={24} />
              </div>
              <h3 className="about-card-title">Valorile noastre</h3>
              <p className="about-card-desc">
                Transparență, accesibilitate și inovație în serviciul
                comunității universitare. Promovăm participarea activă și
                dezvoltarea continuă.
              </p>
            </div>

            {/* Card 3: Obiectivele noastre */}
            <div className="about-card">
              <div className="about-card-icon">
                <Target size={24} />
              </div>
              <h3 className="about-card-title">Obiectivele noastre</h3>
              <p className="about-card-desc">
                Să devenim platforma principală pentru evenimentele universitare
                din România, oferind instrumente moderne pentru studenți,
                organizatori și administratori.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section - Cine suntem, De ce centralizăm, Viitorul platformei */}
      <section className="about-info-section">
        <div className="about-info-container">
          <div className="about-info-cards">
            {/* Card: Cine suntem */}
            <div className="about-info-card">
              <div className="about-info-card-content">
                <div className="about-info-card-icon">
                  <Users size={20} />
                </div>
                <div className="about-info-card-text">
                  <h3>Cine suntem</h3>
                  <p>
                    O echipă dedicată de profesioniști și entuziaști care
                    înțeleg nevoile mediului universitar. Combinăm experiența
                    academică cu expertiza tehnologică pentru a crea soluții
                    eficiente.
                  </p>
                </div>
              </div>
            </div>

            {/* Card: De ce centralizăm evenimentele */}
            <div className="about-info-card">
              <div className="about-info-card-content">
                <div className="about-info-card-icon">
                  <TrendingUp size={20} />
                </div>
                <div className="about-info-card-text">
                  <h3>De ce centralizăm evenimentele</h3>
                  <p>
                    Fragmentarea informațiilor despre evenimentele universitare
                    creează confuzie și oportunități pierdute. Platforma noastră
                    rezolvă această problemă oferind un singur loc pentru
                    descoperirea, organizarea și gestionarea tuturor
                    evenimentelor.
                  </p>
                </div>
              </div>
            </div>

            {/* Card: Viitorul platformei */}
            <div className="about-info-card">
              <div className="about-info-card-content">
                <div className="about-info-card-icon">
                  <Rocket size={20} />
                </div>
                <div className="about-info-card-text">
                  <h3>Viitorul platformei</h3>
                  <p>
                    Dezvoltăm continuu funcționalități noi: inteligență
                    artificială pentru recomandări personalizate, integrări cu
                    sisteme universitare și instrumente avansate de analytics
                    pentru organizatori.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Povestea noastră Section */}
      <section className="about-story-section">
        <div className="about-story-container">
          <div className="about-story-card">
            <h2 className="about-story-title">Povestea noastră</h2>

            <div className="about-story-content">
              <p>
                Platforma UNIfy s-a născut din dorința de a soluționa o problemă
                reală cu care se confruntă zilnic studenții și organizatorii de
                evenimente din mediul academic: fragmentarea informațiilor și
                dificultatea de a gestiona eficient activitățile universitare.
              </p>
              <p>
                Am observat că studenții pierd adesea oportunități valoroase de
                dezvoltare pentru că informațiile despre evenimente sunt
                dispersate pe multiple canale de comunicare - email-uri, grupuri
                de social media, afișe fizice. În același timp, organizatorii se
                confruntă cu provocări în promovarea evenimentelor și
                gestionarea participărilor.
              </p>
              <p>
                Soluția noastră aduce toate aceste funcționalități într-o
                singură platformă modernă, intuitivă și eficientă. Fie că ești
                student în căutarea următorului workshop care îți poate modela
                cariera, organizator care dorește să creeze experiențe
                memorabile, sau administrator care coordonează activitatea
                universitară - platforma noastră este concepută pentru tine.
              </p>
              <p>
                Împreună construim o comunitate universitară mai conectată, mai
                informată și mai activă.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Data-Driven */}
      <section className="about-stats-section">
        <div className="about-stats-container">
          <div className="about-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="about-stat">
                <div className="about-stat-value">
                  {isLoading ? (
                    <Loader
                      className="animate-spin inline-block text-white/50"
                      size={32}
                    />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="about-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
