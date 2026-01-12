// Organizer Types

export interface OrganizerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface Event {
  id: string;
  name: string; // În UI folosim "name", backend-ul trimite "title", dar adaptorul le mapează.
  type: string;
  description: string;
  faculty: string;
  date: string;
  deadline: string;
  location: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  // ✅ FIX: Am adăugat toate statusurile posibile din Backend ca să nu ai erori de tip
  status: "active" | "inactive" | "draft" | "pending" | "rejected";
  materials?: number;
  createdAt: string;
  updatedAt: string;
  organizerId: string;
}

export interface CreateEventData {
  name: string;
  // ✅ FIX: Am adăugat ID-urile pentru a fi compatibil cu dropdown-urile noi
  type_id?: number;
  faculty_id?: number;

  // Păstrăm și string-urile pentru compatibilitate veche
  type?: string;
  faculty?: string;

  description: string;
  date: string; // string ISO sau YYYY-MM-DD
  deadline: string;
  location: string;
  duration: string;
  maxParticipants: number;
}

// ✅ FIX: UpdateEventData extinde CreateEventData, dar definim explicit ID-urile și statusul complet
export interface UpdateEventData extends Partial<CreateEventData> {
  status?: "active" | "inactive" | "draft" | "pending" | "rejected";

  // Explicităm câmpurile care lipseau și cauzau erori în EditEventPage
  faculty_id?: number;
  type_id?: number;

  // Asigurăm că TypeScript știe de deadline și duration (deși sunt în CreateEventData, e bine să fim siguri)
  deadline?: string;
  duration?: string;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  registeredAt: string;
  confirmed: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  isNew: boolean;
  type: "info" | "warning" | "success" | "error";
}

export interface DashboardStats {
  activeEvents: number;
  totalParticipants: number;
  uploadedMaterials: number;
}
