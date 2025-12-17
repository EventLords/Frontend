// src/features/students/pages/MyEventsPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, ChevronRight } from 'lucide-react';

// CORECTARE CRITICĂ: Importăm tipurile reale din fișierul tău de tipuri
import { StudentEvent, EventCategory } from '../../../types/student'; 

// CORECTARE IMAGINI: Calea trebuie să fie corectă pentru sistemul tău de build.
import eventImage1 from "../../../assets/events/image_ev1.png";
import eventImage2 from "../../../assets/events/image_ev2.png";
import eventImage3 from "../../../assets/events/image_ev3.png";

// Importă componenta ta EventCard
import EventCard from '../components/EventCard'; 


// -------------------------------------------------------------------------
// MOCK DATA (ALINIATĂ 100% LA TIPUL TĂU StudentEvent)
// -------------------------------------------------------------------------

const mockEnrolledEvents: StudentEvent[] = [
    { 
        id: 'E1', 
        name: 'Workshop React & TypeScript', // Proprietatea NAME
        description: 'Învață cele mai bune practici pentru dezvoltarea aplicațiilor moderne cu React și TypeScript.', 
        date: '15 dec. 2024', time: '10:00', endTime: '14:00', location: 'Campus Central, Sala A101', 
        organizer: { id: 'O1', name: 'Tech Club' }, // Proprietatea ORGANIZER (obiect)
        currentParticipants: 32, maxParticipants: 50, faculty: 'FIRESC', 
        category: 'workshop' as EventCategory, // Valoare CORECTĂ din EventCategory
        image: eventImage1, isEnrolled: true, tags: ['React', 'TypeScript', 'Frontend'], 
        imageUrl: eventImage1, participants: 32 // Proprietăți legacy pentru compatibilitate
    } as StudentEvent, 
    { 
        id: 'E2', name: 'Conferința Tech Innovation 2024', 
        description: 'Conferință anuală dedicată inovațiilor tehnologice. Speakeri din industrie, networking și oportunități de carieră.', 
        date: '20 dec. 2024', time: '16:00', location: 'Aula Magna', 
        organizer: { id: 'O2', name: 'Info Dept.' }, currentParticipants: 245, maxParticipants: 300, faculty: 'FII', 
        category: 'conferinta' as EventCategory, // Valoare CORECTĂ din EventCategory
        image: eventImage2, isEnrolled: true, tags: ['Tech', 'Innovation', 'Career'], 
        imageUrl: eventImage2, participants: 245
    } as StudentEvent,
    { 
        id: 'E3', name: 'Training Leadership & Soft Skills', 
        description: 'Dezvoltă-ți abilitățile de leadership și comunicare. Certificat de participare inclus.', 
        date: '25 dec. 2024', time: '09:00', location: 'Biblioteca Centrală, Sala Conferințe', 
        organizer: { id: 'O3', name: 'HR Dept.' }, currentParticipants: 40, maxParticipants: 80, faculty: 'FSE', 
        category: 'training' as EventCategory, // Valoare CORECTĂ din EventCategory
        image: eventImage3, isEnrolled: true, tags: ['Leadership', 'Training'], 
        imageUrl: eventImage3, participants: 40
    } as StudentEvent,
];

// -------------------------------------------------------------------------


const MyEventsPage: React.FC = () => {
    // Folosim tipul importat StudentEvent
    const [events, setEvents] = useState<StudentEvent[]>([]); 
    const [filteredEvents, setFilteredEvents] = useState<StudentEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fundalul tău violet/albastru
    const darkBgColor = '#3F3176'; 
    const secondaryColor = '#7B6DB5';
    const highlightColor = '#4ECDC4';

    useEffect(() => {
        const fetchMyEvents = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 500)); 
                const myEvents = mockEnrolledEvents; 

                setEvents(myEvents);
                setFilteredEvents(myEvents);

            } catch (error) {
                console.error("Eroare la preluarea evenimentelor înscrise:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyEvents();
    }, []);

    // Logica de filtrare a căutării
    useEffect(() => {
        if (!searchTerm) {
            setFilteredEvents(events);
            return;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = events.filter(event => 
            event.name.toLowerCase().includes(lowerCaseSearch) ||
            event.description.toLowerCase().includes(lowerCaseSearch) ||
            event.organizer.name.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredEvents(results);
    }, [searchTerm, events]);


    return (
        <div 
            className="min-h-screen pb-16 text-white" 
            style={{ 
                backgroundColor: darkBgColor, 
                backgroundImage: `radial-gradient(at top center, ${secondaryColor} 0%, ${darkBgColor} 70%, #171738 100%)`,
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24"> 
                
                {/* Antetul paginii */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Evenimentele Mele
                    </h1>
                    <p className="text-lg text-white/70">
                        Vizualizează, gestionează și accesează rapid evenimentele la care ești înscris(ă).
                    </p>
                </div>

                {/* Căutare și Filtre (Design din image_5f3ad8.jpg) */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 shadow-lg">
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={18} className="text-white/50" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Caută în evenimentele tale..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-4 pl-10 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/50 text-base focus:outline-none focus:border-[#4ECDC4] transition-colors" 
                        />
                    </div>
                    
                    {/* Butoane de acțiune rapidă */}
                    <div className="flex flex-wrap gap-3 text-sm">
                        <Link 
                            to="/student/calendar" 
                            className="flex items-center gap-2 px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3dbdb5] transition-colors font-semibold"
                        >
                            <Calendar size={16} /> Vezi Calendar
                        </Link>
                        
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <Filter size={16} /> Resetează Căutarea
                        </button>
                    </div>
                </div>


                {/* Rezultate și Grid de Evenimente */}
                <p className="text-white/60 mb-6 text-base">
                    În total, ai {filteredEvents.length} evenimente înscrise care se potrivesc criteriilor.
                </p>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-[#4ECDC4] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/60">Se încarcă evenimentele tale...</p>
                    </div>
                ) : filteredEvents.length === 0 && events.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
                        <Search size={48} className="mx-auto text-white/20 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Nu ești înscris(ă) la niciun eveniment
                        </h3>
                        <p className="text-white/60 mb-4 max-w-sm mx-auto">
                            Vizitează pagina de descoperire pentru a găsi evenimente noi la care să participi.
                        </p>
                        <Link
                            to="/student/dashboard" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4ECDC4] text-white font-medium rounded-xl hover:bg-[#3dbdb5] transition-colors"
                        >
                            Descoperă evenimente <ChevronRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {filteredEvents.map((event) => (
                            <Link 
                                to={`/student/events/${event.id}`} 
                                key={event.id}
                                className="block h-full"
                            >
                                <EventCard event={event} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEventsPage;