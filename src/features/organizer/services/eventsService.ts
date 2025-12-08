import { Event, CreateEventData, UpdateEventData, Participant, DashboardStats } from '../../../types/organizer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Mock data for development
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Avast Open Doors',
    type: 'Workshop',
    description: 'Eveniment despre securitate cibernetică',
    faculty: 'FIESC',
    date: '2025-03-20',
    deadline: '2025-03-15',
    location: 'Sala A1',
    duration: '3 ore',
    maxParticipants: 100,
    currentParticipants: 76,
    status: 'active',
    materials: 5,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-10',
    organizerId: '1'
  },
  {
    id: '2',
    name: 'HardSkill',
    type: 'Conferință',
    description: 'Conferință despre competențe tehnice',
    faculty: 'FIESC',
    date: '2025-04-10',
    deadline: '2025-04-05',
    location: 'Amfiteatrul NB',
    duration: '5 ore',
    maxParticipants: 150,
    currentParticipants: 100,
    status: 'active',
    materials: 8,
    createdAt: '2025-01-05',
    updatedAt: '2025-01-15',
    organizerId: '1'
  },
  {
    id: '3',
    name: 'ASii',
    type: 'Hackathon',
    description: 'Competiție de programare',
    faculty: 'FIESC',
    date: '2025-05-01',
    deadline: '2025-04-25',
    location: 'Laborator C2',
    duration: '48 ore',
    maxParticipants: 50,
    currentParticipants: 50,
    status: 'active',
    materials: 3,
    createdAt: '2025-02-01',
    updatedAt: '2025-02-10',
    organizerId: '1'
  },
  {
    id: '4',
    name: 'Treasure Hunt',
    type: 'Competiție',
    description: 'Vânătoare de comori în campus',
    faculty: 'Toate',
    date: '2025-06-15',
    deadline: '2025-06-10',
    location: 'Campus USV',
    duration: '6 ore',
    maxParticipants: 200,
    currentParticipants: 10,
    status: 'inactive',
    materials: 2,
    createdAt: '2025-03-01',
    updatedAt: '2025-03-05',
    organizerId: '1'
  },
  {
    id: '5',
    name: 'Târgul companiilor',
    type: 'Târg',
    description: 'Târg de cariere pentru studenți',
    faculty: 'Toate',
    date: '2025-07-20',
    deadline: '2025-07-15',
    location: 'Sala Mare',
    duration: '8 ore',
    maxParticipants: 500,
    currentParticipants: 60,
    status: 'active',
    materials: 10,
    createdAt: '2025-03-10',
    updatedAt: '2025-03-15',
    organizerId: '1'
  }
];

const mockParticipants: Participant[] = [
  { id: '1', firstName: 'Maria', lastName: 'Ionescu', email: 'maria@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-01-15', confirmed: true },
  { id: '2', firstName: 'Sara', lastName: 'Popescu', email: 'sara@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-01-16', confirmed: true },
  { id: '3', firstName: 'Andrei', lastName: 'Munteanu', email: 'andrei@student.usv.ro', faculty: 'FDSA', registeredAt: '2025-01-17', confirmed: true },
  { id: '4', firstName: 'Maria', lastName: 'Georgescu', email: 'maria.g@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-01-18', confirmed: false },
  { id: '5', firstName: 'Anda', lastName: 'Vasilescu', email: 'anda@student.usv.ro', faculty: 'FEFS', registeredAt: '2025-01-19', confirmed: true },
  { id: '6', firstName: 'Matei', lastName: 'Dumitrescu', email: 'matei@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-01-20', confirmed: false },
  { id: '7', firstName: 'Ella', lastName: 'Radu', email: 'ella@student.usv.ro', faculty: 'FEFS', registeredAt: '2025-01-21', confirmed: true },
  { id: '8', firstName: 'Anca', lastName: 'Stanescu', email: 'anca@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-01-22', confirmed: true },
  { id: '9', firstName: 'Nume', lastName: 'Test', email: 'nume@student.usv.ro', faculty: 'FDSA', registeredAt: '2025-01-23', confirmed: false },
  { id: '10', firstName: 'Ionut', lastName: 'Popa', email: 'ionut@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-01-24', confirmed: true },
  { id: '11', firstName: 'Andra', lastName: 'Mihai', email: 'andra@student.usv.ro', faculty: 'FEFS', registeredAt: '2025-01-25', confirmed: true },
  { id: '12', firstName: 'Alex', lastName: 'Neagu', email: 'alex@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-01-26', confirmed: true },
  { id: '13', firstName: 'Mara', lastName: 'Florea', email: 'mara@student.usv.ro', faculty: 'FDSA', registeredAt: '2025-01-27', confirmed: false },
  { id: '14', firstName: 'Bianca', lastName: 'Tudor', email: 'bianca@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-01-28', confirmed: true },
  { id: '15', firstName: 'Mara', lastName: 'Costin', email: 'mara.c@student.usv.ro', faculty: 'FEFS', registeredAt: '2025-01-29', confirmed: true },
  { id: '16', firstName: 'Nume', lastName: 'Exemplu', email: 'exemplu@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-01-30', confirmed: false },
  { id: '17', firstName: 'Alex', lastName: 'Barbu', email: 'alex.b@student.usv.ro', faculty: 'FDSA', registeredAt: '2025-02-01', confirmed: true },
  { id: '18', firstName: 'Sanda', lastName: 'Iliescu', email: 'sanda@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-02-02', confirmed: true },
  { id: '19', firstName: 'Eunice', lastName: 'Preda', email: 'eunice@student.usv.ro', faculty: 'FEFS', registeredAt: '2025-02-03', confirmed: true },
  { id: '20', firstName: 'Magda', lastName: 'Serban', email: 'magda@student.usv.ro', faculty: 'FIESC', registeredAt: '2025-02-04', confirmed: false },
  { id: '21', firstName: 'Alina', lastName: 'Marin', email: 'alina@student.usv.ro', faculty: 'FDSA', registeredAt: '2025-02-05', confirmed: true },
];

// Service functions
export const eventsService = {
  // Get all events for the organizer
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/events`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for events');
      return mockEvents;
    }
  },

  // Get single event by ID
  async getEventById(id: string): Promise<Event | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch event');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for event');
      return mockEvents.find(e => e.id === id) || null;
    }
  },

  // Create new event
  async createEvent(data: CreateEventData): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create event');
      return await response.json();
    } catch (error) {
      console.warn('Mock: Event created');
      const newEvent: Event = {
        id: String(mockEvents.length + 1),
        ...data,
        currentParticipants: 0,
        status: 'draft',
        materials: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organizerId: '1'
      };
      mockEvents.push(newEvent);
      return newEvent;
    }
  },

  // Update event
  async updateEvent(id: string, data: UpdateEventData): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update event');
      return await response.json();
    } catch (error) {
      console.warn('Mock: Event updated');
      const eventIndex = mockEvents.findIndex(e => e.id === id);
      if (eventIndex !== -1) {
        mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...data, updatedAt: new Date().toISOString() };
        return mockEvents[eventIndex];
      }
      throw new Error('Event not found');
    }
  },

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete event');
    } catch (error) {
      console.warn('Mock: Event deleted');
      const eventIndex = mockEvents.findIndex(e => e.id === id);
      if (eventIndex !== -1) {
        mockEvents.splice(eventIndex, 1);
      }
    }
  },

  // Get participants for an event
  async getParticipants(eventId: string): Promise<Participant[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/events/${eventId}/participants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch participants');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for participants');
      return mockParticipants;
    }
  },

  // Get dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for stats');
      return {
        activeEvents: mockEvents.filter(e => e.status === 'active').length,
        totalParticipants: mockEvents.reduce((sum, e) => sum + e.currentParticipants, 0),
        uploadedMaterials: mockEvents.reduce((sum, e) => sum + (e.materials || 0), 0)
      };
    }
  },

  // Export participants to CSV
  exportParticipantsToCSV(participants: Participant[], eventName: string): void {
    const headers = ['Nume', 'Prenume', 'Email', 'Facultate', 'Data înregistrării', 'Confirmat'];
    const rows = participants.map(p => [
      p.lastName,
      p.firstName,
      p.email,
      p.faculty,
      new Date(p.registeredAt).toLocaleDateString('ro-RO'),
      p.confirmed ? 'Da' : 'Nu'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `participanti_${eventName.replace(/\s+/g, '_')}.csv`;
    link.click();
  }
};

export default eventsService;
