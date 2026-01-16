import { StudentEvent } from "../../../types/student";

// 1. Definim URL-ul serverului de backend pentru resurse statice
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Extragem root-ul serverului pentru a accesa folderul /uploads (eliminăm /api de la final)
const SERVER_URL = API_URL.replace(/\/api$/, "");

/**
 * Mapper pentru transformarea obiectului Event din API (Prisma)
 * în obiectul StudentEvent utilizat în interfața de Frontend.
 */
export const mapApiEventToStudentEvent = (e: any): StudentEvent => {
  // --- LOGICĂ RECUPERARE COPERTĂ ---

  // 1. Căutăm fișierul marcat explicit ca imagine de copertă
  let coverFile = e.files?.find(
    (f: any) => f.is_cover === true || f.isCover === true
  );

  // 2. Fallback: Dacă nu există un cover marcat, luăm prima imagine validă din array
  if (!coverFile && e.files && e.files.length > 0) {
    coverFile = e.files.find(
      (f: any) => f.file_path && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.file_path)
    );
  }

  // --- CONSTRUIRE URL IMAGINE ---

  let imageUrl = "/assets/events/default.png"; // Imaginea placeholder implicită

  if (coverFile?.file_path) {
    // Curățăm calea (backslashes în forward slashes)
    let cleanPath = coverFile.file_path.replace(/\\/g, "/").replace(/^\//, "");

    if (cleanPath.startsWith("http")) {
      // Dacă este URL absolut (ex: Cloudinary), îl folosim direct
      imageUrl = cleanPath;
    } else {
      // Asigurăm prefixul "uploads/" pentru serverul de backend (port 3001)
      if (!cleanPath.startsWith("uploads/")) {
        cleanPath = `uploads/${cleanPath}`;
      }
      imageUrl = `${SERVER_URL}/${cleanPath}`;
    }
  }

  // --- MAPARE CÂMPURI ---

  // Extract time from ISO date string (e.g., "2026-01-25T11:00:00.000Z" -> "11:00")
  const extractTime = (isoString: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return {
    id: String(e.id_event),
    name: e.title,
    description: e.description || "",
    category: e.event_types?.name || "Altele",
    date: e.date_start || "",
    time: extractTime(e.date_start),
    endTime: e.date_end ? extractTime(e.date_end) : "",
    location: e.location || "Nespecificată",
    image: imageUrl,

    organizer: {
      id: String(e.organizer_id),
      name:
        e.users?.organization_name ??
        (e.users?.first_name
          ? `${e.users.first_name} ${e.users.last_name}`
          : "Organizator"),
      avatar: undefined,
    },

    maxParticipants: (e.max_participants ?? e.maxParticipants ?? 0) as number,
    currentParticipants: e.registrations?.length ?? 0,
    faculty: e.faculties?.name ?? "",
    tags: [], // Extensibilitate viitoare
    isEnrolled: e.isEnrolled ?? false,
  };
};
