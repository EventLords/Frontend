// src/types/student.ts

// =========================
// EVENTS
// =========================

/**
 * Categoriile oficiale suportate de sistem.
 * Folosim string literal types pentru validare strictă.
 */
export type EventCategory =
  | "Workshop"
  | "Conferință"
  | "Hackathon"
  | "Seminar"
  | "Târg"
  | "Competiție"
  | "Training"
  | "Networking"
  | "Altele";

/**
 * Interfața principală pentru un eveniment vizualizat de student.
 * Include toate proprietățile necesare pentru randarea în EventCard și EventDetailsPage.
 */
export interface StudentEvent {
  id: string;
  title?: string; // Menținut pentru compatibilitate cu structura brută a DB
  name: string; // Mapat din title pentru UI consistent
  description: string;
  category: EventCategory;
  date: string; // Format ISO sau YYYY-MM-DD
  time: string; // Format HH:mm
  endTime?: string;
  location: string;
  image?: string; // URL final (procesat)
  imageUrl?: string; // ✅ Păstrat: Proprietatea pentru maparea brută din backend
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  maxParticipants: number;
  currentParticipants: number;
  faculty: string;
  tags: string[];
  agenda?: any[];

  // Stări specifice utilizatorului curent
  isEnrolled?: boolean;
  /** * ✅ FIX: Adăugat isFavorite pentru a permite funcționalitatea de "Inimioară"
   * și a elimina erorile de compilare în EventCard și FavoritesPage.
   */
  isFavorite?: boolean;

  // ✅ Păstrat: Definiția fișierelor pentru suport Materiale & Suport curs
  files?: Array<{
    id_file: number;
    file_path: string;
    original_name: string;
    mimetype: string;
    size: number;
    is_cover: boolean;
  }>;
}

// =========================
// FILTERS
// =========================

/**
 * Structura pentru starea filtrelor din Dashboard.
 */
export interface EventFilters {
  search: string;
  category: EventCategory | "all";
  period: "all" | "today" | "this_week" | "this_month" | "upcoming";
  location: string;
  faculty: string;
}

// =========================
// NOTIFICATIONS
// =========================

export type StudentNotificationType =
  | "EVENT_CREATED"
  | "EVENT_UPDATED"
  | "EVENT_DELETED"
  | "EVENT_APPROVED"
  | "EVENT_REJECTED"
  | "EVENT_SUBMITTED_FOR_REVIEW"
  | "EVENT_REGISTERED"
  | "EVENT_UNREGISTERED"
  | "EVENT_FULL"
  | "EVENT_THRESHOLD_REACHED"
  | "EVENT_FAVORITED"
  | "EVENT_RECOMMENDED"
  | "ACCOUNT_CREATED"
  | "ACCOUNT_APPROVED"
  | "ACCOUNT_REJECTED"
  | "ADMIN_EVENT_PENDING"
  | "ADMIN_ORGANIZER_PENDING"
  | "FEEDBACK_REQUESTED"
  | "FAVORITE_REMINDER_24H"
  | "FAVORITE_REMINDER_1H";

export interface StudentNotification {
  id: number;
  type: StudentNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// =========================
// ENROLLMENT (CORECȚII SENIOR)
// =========================

/**
 * Reprezintă înscrierea unui student la un eveniment.
 */
export interface Enrollment {
  id: string;
  eventId: string;
  studentId: string;
  enrollmentDate: string;
  qrCode: string;
  status: "confirmed" | "pending" | "cancelled";
  /** * ✅ FIX: Adăugat checked_in pentru a permite logica de feedback
   * disponibilă doar după ce studentul a fost prezent fizic la eveniment.
   */
  checked_in: boolean;
  event?: StudentEvent;
}

// =========================
// CALENDAR
// =========================

/**
 * Structura necesară pentru randarea grid-ului în CalendarPage.
 */
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: StudentEvent[];
}
