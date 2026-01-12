import React from 'react';
import { Sparkles, Heart, Target, Users, TrendingUp, Rocket } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Evenimente organizate' },
  { value: '10K+', label: 'Studenți activi' },
  { value: '150+', label: 'Organizatori' },
  { value: '25+', label: 'Facultăți conectate' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Gradient mint to purple */}
      <section className="bg-gradient-to-b from-[#DFF3E4] via-[#c4d4f4] to-[#504C8C] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a4e] mb-4">
              Despre noi
            </h1>
            <p className="text-lg md:text-xl text-[#1a1a4e]/80 max-w-2xl mx-auto">
              Construim viitorul evenimentelor universitare prin<br />
              tehnologie și dedicare
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Values, Objectives - 3 Cards */}
      <section className="bg-gradient-to-b from-[#504C8C] to-[#3F3176] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Misiunea noastră */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="w-12 h-12 rounded-xl bg-[#DFF3E4] flex items-center justify-center mb-4 border border-[#3F3176]/20">
                <Sparkles className="text-[#3F3176]" size={24} />
              </div>
              <h3 className="font-bold text-lg text-[#1a1a4e] mb-2">Misiunea noastră</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Să centralizăm și să simplificăm accesul la toate evenimentele universitare, 
                creând o experiență unificată pentru întreaga comunitate academică.
              </p>
            </div>

            {/* Card 2: Valorile noastre */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="w-12 h-12 rounded-xl bg-[#DFF3E4] flex items-center justify-center mb-4 border border-[#3F3176]/20">
                <Heart className="text-[#3F3176]" size={24} />
              </div>
              <h3 className="font-bold text-lg text-[#1a1a4e] mb-2">Valorile noastre</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Transparență, accesibilitate și inovație în serviciul comunității universitare. 
                Promovăm participarea activă și dezvoltarea continuă.
              </p>
            </div>

            {/* Card 3: Obiectivele noastre */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="w-12 h-12 rounded-xl bg-[#DFF3E4] flex items-center justify-center mb-4 border border-[#3F3176]/20">
                <Target className="text-[#3F3176]" size={24} />
              </div>
              <h3 className="font-bold text-lg text-[#1a1a4e] mb-2">Obiectivele noastre</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Să devenim platforma principală pentru evenimentele universitare din România, 
                oferind instrumente moderne pentru studenți, organizatori și administratori.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section - Cine suntem, De ce centralizăm, Viitorul platformei */}
      <section className="bg-gradient-to-b from-[#3F3176] to-[#2E1760] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Card: Cine suntem */}
          <div className="bg-[#2E1760]/80 backdrop-blur rounded-2xl p-5 border border-[#504C8C]/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#DFF3E4] flex items-center justify-center flex-shrink-0 border border-[#3F3176]/20">
                <Users className="text-[#3F3176]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Cine suntem</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  O echipă dedicată de profesioniști și entuziaști care înțeleg nevoile mediului universitar. 
                  Combinăm experiența academică cu expertiza tehnologică pentru a crea soluții eficiente.
                </p>
              </div>
            </div>
          </div>

          {/* Card: De ce centralizăm evenimentele */}
          <div className="bg-[#2E1760]/80 backdrop-blur rounded-2xl p-5 border border-[#504C8C]/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#DFF3E4] flex items-center justify-center flex-shrink-0 border border-[#3F3176]/20">
                <TrendingUp className="text-[#3F3176]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">De ce centralizăm evenimentele</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Fragmentarea informațiilor despre evenimentele universitare creează confuzie și oportunități pierdute. 
                  Platforma noastră rezolvă această problemă oferind un singur loc pentru descoperirea, organizarea și gestionarea tuturor evenimentelor.
                </p>
              </div>
            </div>
          </div>

          {/* Card: Viitorul platformei */}
          <div className="bg-[#2E1760]/80 backdrop-blur rounded-2xl p-5 border border-[#504C8C]/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#DFF3E4] flex items-center justify-center flex-shrink-0 border border-[#3F3176]/20">
                <Rocket className="text-[#3F3176]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Viitorul platformei</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Dezvoltăm continuu funcționalități noi: inteligență artificială pentru recomandări 
                  personalizate, integrări cu sisteme universitare și instrumente avansate de analytics pentru organizatori.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Povestea noastră Section */}
      <section className="bg-gradient-to-b from-[#2E1760] to-[#1a1a4e] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#3F3176] via-[#504C8C] to-[#6B5B9A] rounded-3xl p-8 md:p-12 border border-[#7B6DB5]/30 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Povestea noastră
            </h2>
            
            <div className="text-white/85 text-sm md:text-base leading-relaxed space-y-4">
              <p>
                Platforma Evenimente Universitare s-a născut din dorința de a soluționa o problemă 
                reală cu care se confruntă zilnic studenții și organizatorii de evenimente din mediul 
                academic: fragmentarea informațiilor și dificultatea de a gestiona eficient activitățile universitare.
              </p>
              <p>
                Am observat că studenții pierd adesea oportunități valoroase de dezvoltare pentru că 
                informațiile despre evenimente sunt dispersate pe multiple canale de comunicare - 
                email-uri, grupuri de social media, afișe fizice. În același timp, organizatorii se 
                confruntă cu provocări în promovarea evenimentelor și gestionarea participărilor.
              </p>
              <p>
                Soluția noastră aduce toate aceste funcționalități într-o singură platformă modernă, 
                intuitivă și eficientă. Fie că ești student în căutarea următorului workshop care 
                îți poate modela cariera, organizator care dorește să creeze experiențe memorabile, 
                sau administrator care coordonează activitatea universitară - platforma noastră 
                este concepută pentru tine.
              </p>
              <p>
                Împreună construim o comunitate universitară mai conectată, mai informată și mai activă.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Light background */}
      <section className="bg-[#DFF3E4] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#1a1a4e] mb-1">
                  {stat.value}
                </div>
                <div className="text-[#3F3176] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
