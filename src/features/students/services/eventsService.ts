// src/features/students/services/eventsService.ts

import { StudentEvent, EventFilters, EventCategory } from '../../../types/student';

// Import local event images
// 🛑 Te rog să verifici și să ajustezi aceste căi dacă dă eroare la imagini.
import eventImage1 from '../../../assets/events/image_ev1.png';
import eventImage2 from '../../../assets/events/image_ev2.png';
import eventImage3 from '../../../assets/events/image_ev3.png';
import eventImage4 from '../../../assets/events/image_ev4.png';
import eventImage5 from '../../../assets/events/image_ev5.png';
import eventImage6 from '../../../assets/events/image_ev6.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Mock data for development
const mockEvents: StudentEvent[] = [
  {
    id: 'E1', // 🛑 ID-uri CORECTATE
    name: 'Workshop React & TypeScript',
    description: 'Învață cele mai bune practici pentru dezvoltarea aplicațiilor moderne cu React și TypeScript. Workshop-ul include sesiuni practice și exemple din proiecte reale.',
    category: 'workshop' as EventCategory,
    date: '2024-12-15',
    time: '10:00',
    endTime: '14:00',
    location: 'Campus Central, Sala A101',
    image: eventImage1,
    organizer: { id: '1', name: 'FIESC', avatar: undefined },
    maxParticipants: 50,
    currentParticipants: 32,
    faculty: 'FIESC',
    tags: ['React', 'TypeScript', 'Frontend'],
    agenda: [
      { time: '10:00', title: 'Introducere în React', speaker: 'Dr. Ion Popescu' },
      { time: '11:30', title: 'TypeScript Basics', speaker: 'Prof. Maria Ionescu' },
      { time: '13:00', title: 'Proiect practic', description: 'Construim împreună o aplicație' },
    ],
    isEnrolled: false,
  },
  {
    id: 'E2', // 🛑 ID-uri CORECTATE
    name: 'Conferința Tech Innovation 2024',
    description: 'Conferință anuală dedicată inovațiilor tehnologice. Speakeri din industrie, networking și oportunități de carieră.',
    category: 'conferinta' as EventCategory,
    date: '2024-12-20',
    time: '09:00',
    endTime: '18:00',
    location: 'Aula Magna',
    image: eventImage3,
    organizer: { id: '2', name: 'USV', avatar: undefined },
    maxParticipants: 300,
    currentParticipants: 245,
    faculty: 'Toate facultățile',
    tags: ['Tech', 'Innovation', 'Career'],
    isEnrolled: true,
    enrollmentDate: '2024-12-01',
  },
  {
    id: 'E3', // 🛑 ID-uri CORECTATE
    name: 'Hackathon USV 2024',
    description: '48 de ore de programare intensivă. Formează o echipă și construiește soluția viitorului!',
    category: 'hackathon' as EventCategory,
    date: '2024-12-22',
    time: '18:00',
    endTime: '18:00',
    location: 'Campus Nord, Corp C',
    image: eventImage2,
    organizer: { id: '3', name: 'Liga AC', avatar: undefined },
    maxParticipants: 100,
    currentParticipants: 76,
    faculty: 'FIESC',
    tags: ['Hackathon', 'Programming', 'Competition'],
    isEnrolled: false,
  },
  {
    id: 'E4', // 🛑 ID-uri CORECTATE
    name: 'Seminar AI & Machine Learning',
    description: 'Explorează lumea inteligenței artificiale cu experți din domeniu. Aplicații practice și studii de caz.',
    category: 'seminar' as EventCategory,
    date: '2024-12-18',
    time: '14:00',
    endTime: '17:00',
    location: 'Online',
    image: eventImage5,
    organizer: { id: '1', name: 'FIESC', avatar: undefined },
    maxParticipants: 200,
    currentParticipants: 156,
    faculty: 'FIESC',
    tags: ['AI', 'Machine Learning', 'Data Science'],
    isEnrolled: true,
    enrollmentDate: '2024-12-05',
  },
  {
    id: 'E5', // 🛑 ID-uri CORECTATE
    name: 'Târgul Carierei 2024',
    description: 'Întâlnește cele mai importante companii din industrie. Oportunități de internship și angajare.',
    category: 'targ' as EventCategory,
    date: '2024-12-28',
    time: '10:00',
    endTime: '16:00',
    location: 'Campus Central',
    image: eventImage4,
    organizer: { id: '4', name: 'CCOC USV', avatar: undefined },
    maxParticipants: 500,
    currentParticipants: 312,
    faculty: 'Toate facultățile',
    tags: ['Career', 'Jobs', 'Networking'],
    isEnrolled: false,
  },
  {
    id: 'E6', // 🛑 ID-uri CORECTATE
    name: 'Training Leadership & Soft Skills',
    description: 'Dezvoltă-ți abilitățile de leadership și comunicare. Certificat de participare inclus.',
    category: 'training' as EventCategory,
    date: '2024-12-25',
    time: '09:00',
    endTime: '13:00',
    location: 'Biblioteca Centrală, Sala Conferințe',
    image: eventImage6,
    organizer: { id: '5', name: 'Centrul de Consiliere', avatar: undefined },
    maxParticipants: 30,
    currentParticipants: 28,
    faculty: 'Toate facultățile',
    tags: ['Leadership', 'Soft Skills', 'Development'],
    isEnrolled: false,
  },
];

// Helper function to filter events (neschimbată)
const filterEvents = (events: StudentEvent[], filters: EventFilters): StudentEvent[] => {
  return events.filter(event => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        event.name.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category !== 'all' && event.category !== filters.category) {
      return false;
    }

    // Period filter
    if (filters.period !== 'all') {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (filters.period) {
        case 'today':
          const todayStr = today.toISOString().split('T')[0];
          if (event.date !== todayStr) return false;
          break;
        case 'this_week':
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + 7);
          if (eventDate < today || eventDate > weekEnd) return false;
          break;
        case 'this_month':
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          if (eventDate < today || eventDate > monthEnd) return false;
          break;
        case 'upcoming':
          if (eventDate < today) return false;
          break;
      }
    }

    // Location filter
    if (filters.location && filters.location !== 'Toate locațiile') {
      if (!event.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    // Faculty filter
    if (filters.faculty && filters.faculty !== 'Toate facultățile') {
      if (event.faculty !== filters.faculty && event.faculty !== 'Toate facultățile') {
        return false;
      }
    }

    return true;
  });
};

export const studentEventsService = {
  // Get all available events
  async getAllEvents(filters?: EventFilters): Promise<StudentEvent[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const events = await response.json();
      return filters ? filterEvents(events, filters) : events;
    } catch {
      // Return filtered mock data
      return filters ? filterEvents(mockEvents, filters) : mockEvents;
    }
  },

  // Get single event details
  async getEventById(id: string): Promise<StudentEvent | null> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch event');
      return await response.json();
    } catch {
      // 🛑 AICI SE CAUTĂ ID-ul MOCK
      return mockEvents.find(e => e.id === id) || null;
    }
  },

  // Get enrolled events
  async getEnrolledEvents(): Promise<StudentEvent[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/events/enrolled`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch enrolled events');
      return await response.json();
    } catch {
      return mockEvents.filter(e => e.isEnrolled);
    }
  },

  // Get events by date range (for calendar)
  async getEventsByDateRange(startDate: string, endDate: string): Promise<StudentEvent[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/student/events?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch {
      return mockEvents.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
      });
    }
  },

  // Get recommended events
  async getRecommendedEvents(): Promise<StudentEvent[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/events/recommended`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch recommended events');
      return await response.json();
    } catch {
      return mockEvents.slice(0, 4);
    }
  },

  // Get categories with event count
  async getCategoriesWithCount(): Promise<{ category: EventCategory; count: number }[]> {
    try {
      const events = await this.getAllEvents();
      const categoryMap = new Map<EventCategory, number>();
      
      events.forEach(event => {
        const count = categoryMap.get(event.category) || 0;
        categoryMap.set(event.category, count + 1);
      });
      
      return Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count
      }));
    } catch {
      return [];
    }
  }
};