import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown,
  UserPlus,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  Mail
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const GuidePage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Primii Pași',
      icon: <UserPlus size={20} />,
      content: [
        'Accesează pagina de înregistrare și completează formularul cu datele tale.',
        'Folosește adresa de email universitară pentru verificare rapidă.',
        'Confirmă adresa de email prin link-ul primit.',
        'Completează-ți profilul cu informații despre facultate și interese.',
        'Explorează evenimentele disponibile și începe să te înscrii!'
      ]
    },
    {
      id: 'events',
      title: 'Descoperire Evenimente',
      icon: <Calendar size={20} />,
      content: [
        'Accesează pagina "Evenimente" din meniul principal.',
        'Folosește filtrele pentru a găsi evenimente după categorie, dată sau locație.',
        'Click pe un eveniment pentru a vedea detaliile complete.',
        'Apasă "Înscrie-te" pentru a te înregistra la eveniment.',
        'Vei primi confirmarea pe email și în notificări.'
      ]
    },
    {
      id: 'notifications',
      title: 'Notificări și Alerte',
      icon: <Bell size={20} />,
      content: [
        'Activează notificările push din setări pentru alerte în timp real.',
        'Configurează preferințele de email pentru a primi doar ce te interesează.',
        'Vei primi remindere cu 24h și 1h înainte de eveniment.',
        'Notificările importante apar și în clopotelul din header.',
        'Poți marca notificările ca citite sau le poți șterge.'
      ]
    },
    {
      id: 'calendar',
      title: 'Calendar Personal',
      icon: <Calendar size={20} />,
      content: [
        'Accesează calendarul din dashboard-ul tău personal.',
        'Vezi toate evenimentele la care ești înscris într-o singură vedere.',
        'Culorile indică: verde = înscris, violet = disponibil.',
        'Click pe o zi pentru a vedea evenimentele din acea dată.',
        'Sincronizează cu Google Calendar pentru acces de oriunde.'
      ]
    },
    {
      id: 'settings',
      title: 'Setări Cont',
      icon: <Settings size={20} />,
      content: [
        'Accesează setările din meniul profilului tău.',
        'Schimbă parola periodic pentru securitate.',
        'Configurează preferințele de notificări după nevoile tale.',
        'Actualizează informațiile de profil când este necesar.',
        'Poți șterge contul dacă nu mai dorești să folosești platforma.'
      ]
    }
  ];

  const faqs: FAQItem[] = [
    {
      question: 'Cum mă înscriu la un eveniment?',
      answer: 'Accesează pagina evenimentului și apasă butonul "Înscrie-te". Vei primi o confirmare pe email și evenimentul va apărea în calendarul tău personal.'
    },
    {
      question: 'Pot să mă dezabonez de la un eveniment?',
      answer: 'Da, poți să te dezabonezi accesând evenimentul din calendarul tău și apăsând "Renunță la participare". Organizatorul va fi notificat automat.'
    },
    {
      question: 'Cum devin organizator de evenimente?',
      answer: 'Creează un cont și solicită statutul de organizator din setări. Echipa noastră va verifica cererea în 24-48 de ore și vei primi acces la dashboard-ul de organizator.'
    },
    {
      question: 'Evenimentele sunt gratuite?',
      answer: 'Majoritatea evenimentelor universitare sunt gratuite. Dacă un eveniment are o taxă de participare, aceasta va fi afișată clar în detaliile evenimentului.'
    },
    {
      question: 'Cum primesc notificări pentru evenimente noi?',
      answer: 'Activează notificările push și email din setări. Poți selecta categoriile de evenimente care te interesează pentru a primi doar notificări relevante.'
    },
    {
      question: 'Ce fac dacă am uitat parola?',
      answer: 'Accesează pagina de autentificare și apasă "Am uitat parola". Vei primi un link pe email pentru resetarea parolei.'
    }
  ];

  const activeGuide = guideSections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] mb-6">
            <BookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ghid de Utilizare
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Tot ce trebuie să știi pentru a folosi platforma UNIfy la capacitate maximă.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#111427]/60 backdrop-blur-md rounded-2xl border border-[#a78bfa]/15 p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Secțiuni</h3>
              <nav className="space-y-1.5">
                {guideSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[#a78bfa]/20 to-[#7c3aed]/10 text-[#c4b5fd] border border-[#a78bfa]/30'
                        : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <span className={activeSection === section.id ? 'text-[#a78bfa]' : ''}>{section.icon}</span>
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Guide Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#111427]/60 backdrop-blur-md rounded-2xl border border-[#a78bfa]/15 p-6">
              {activeGuide && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a78bfa]/20 to-[#7c3aed]/10 flex items-center justify-center text-[#a78bfa]">
                      {activeGuide.icon}
                    </div>
                    <h2 className="text-xl font-bold text-white">{activeGuide.title}</h2>
                  </div>
                  <ol className="space-y-4">
                    {activeGuide.content.map((step, index) => (
                      <li key={index} className="group flex gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[#a78bfa]/25 to-[#7c3aed]/15 text-[#c4b5fd] text-sm font-semibold flex items-center justify-center group-hover:scale-105 transition-transform">
                          {index + 1}
                        </span>
                        <p className="text-white/70 pt-0.5 leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Întrebări Frecvente</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`group bg-[#111427]/60 backdrop-blur-md rounded-2xl border overflow-hidden transition-all duration-300 ${
                  openFAQ === index 
                    ? 'border-[#a78bfa]/40 shadow-[0_8px_25px_rgba(139,92,246,0.15)]' 
                    : 'border-[#a78bfa]/15 hover:border-[#a78bfa]/30'
                }`}
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-medium pr-4 transition-colors duration-200 ${
                    openFAQ === index ? 'text-[#c4b5fd]' : 'text-white group-hover:text-white/90'
                  }`}>{faq.question}</span>
                  <div className={`p-1 rounded-lg transition-all duration-200 ${
                    openFAQ === index ? 'bg-[#a78bfa]/20 rotate-180' : 'bg-white/5'
                  }`}>
                    <ChevronDown size={18} className={`transition-colors ${
                      openFAQ === index ? 'text-[#a78bfa]' : 'text-white/40'
                    }`} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFAQ === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-5 pb-5">
                    <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-[#a78bfa]/20 to-[#7c3aed]/20 backdrop-blur-sm rounded-2xl border border-[#a78bfa]/30 p-8 text-center">
          <HelpCircle size={40} className="text-[#a78bfa] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Ai nevoie de ajutor suplimentar?</h2>
          <p className="text-white/70 mb-6">
            Echipa noastră de suport este disponibilă să te ajute cu orice întrebare.
          </p>
          <a
            href="mailto:contact@unievents.ro"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#c4b5fd] to-[#7c3aed] text-[#0b0f1f] font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
          >
            <Mail size={18} />
            Contactează suportul
          </a>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
