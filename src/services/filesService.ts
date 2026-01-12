import api from "./api";

// =========================
// TYPES (Match backend Prisma model)
// =========================

export interface EventFile {
  id_file: number;
  event_id: number;
  file_path: string;
  original_name?: string; // Optional, depinde dacă backend-ul îl trimite populate
  is_cover: boolean;
  size?: number;
  uploaded_at: string;
}

// =========================
// FILES SERVICE
// =========================

export const filesService = {
  // 1. UPLOAD: POST /events/:eventId/files
  async uploadFile(eventId: number, file: File): Promise<EventFile> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<EventFile>(
      `/events/${eventId}/files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // 2. LIST: GET /events/:eventId/files
  async getEventFiles(eventId: number): Promise<EventFile[]> {
    const response = await api.get<EventFile[]>(`/events/${eventId}/files`);
    return response.data;
  },

  // 3. SET COVER: PATCH /events/:eventId/files/:fileId/cover
  async setCoverImage(eventId: number, fileId: number): Promise<EventFile> {
    const response = await api.patch<EventFile>(
      `/events/${eventId}/files/${fileId}/cover`
    );
    return response.data;
  },

  // 4. GET COVER: GET /events/:eventId/files/cover
  async getCoverImage(eventId: number): Promise<EventFile | null> {
    const response = await api.get<EventFile | null>(
      `/events/${eventId}/files/cover`
    );
    return response.data;
  },

  // 5. CLEAR COVER: DELETE /events/:eventId/files/cover
  async clearCoverImage(eventId: number): Promise<{ ok: boolean }> {
    const response = await api.delete<{ ok: boolean }>(
      `/events/${eventId}/files/cover`
    );
    return response.data;
  },

  // 6. DELETE FILE: DELETE /events/:eventId/files/:fileId
  async deleteFile(eventId: number, fileId: number): Promise<{ ok: boolean }> {
    const response = await api.delete<{ ok: boolean }>(
      `/events/${eventId}/files/${fileId}`
    );
    return response.data;
  },

  // =========================
  // HELPER PENTRU URL PUBLIC
  // =========================
  getFileUrl: (path: string | undefined | null): string => {
    if (!path) return "";

    // Dacă e deja un URL complet (ex: cloud storage), îl returnăm direct
    if (path.startsWith("http")) return path;

    // Construim URL-ul local bazat pe variabila de mediu sau fallback
    const BASE_URL =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:3001";

    // Curățăm slash-ul de la începutul path-ului pentru a evita dublarea (ex: //uploads)
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // Înlocuim backslash-urile de Windows (\) cu slash-uri normale (/)
    const normalizedPath = cleanPath.replace(/\\/g, "/");

    return `${BASE_URL}/${normalizedPath}`;
  },
};

export default filesService;
