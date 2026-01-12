// src/features/students/services/enrollmentService.ts

import { Enrollment, StudentEvent } from "../../../types/student";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const getToken = (): string | null => {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token")
  );
};

export const enrollmentService = {
  async enrollInEvent(
    eventId: string,
    event: StudentEvent
  ): Promise<Enrollment> {
    const token = getToken();
    if (!token) throw new Error("Nu ești autentificat.");

    const response = await fetch(
      `${API_BASE_URL}/registrations/events/${eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Eroare la înscriere");
    }

    const data = await response.json();
    return {
      id: String(data.id_registration),
      eventId: String(data.event_id),
      studentId: String(data.user_id),
      enrollmentDate: data.registration_date,
      qrCode: data.qr_token,
      status: "confirmed",
      checked_in: data.checked_in || false, // ✅ Adăugat câmpul de check-in
      event: event,
    };
  },

  async getEnrollmentByEventId(eventId: string): Promise<Enrollment | null> {
    const token = getToken();
    if (!token) return null;

    try {
      const myRegistrations = await this.getMyEnrollments();
      const match = myRegistrations.find(
        (reg: any) => String(reg.event_id) === String(eventId)
      );

      if (!match) return null;

      return {
        id: String(match.id_registration),
        eventId: String(match.event_id),
        studentId: String(match.user_id),
        enrollmentDate: match.registration_date,
        qrCode: match.qr_token,
        status: "confirmed",
        checked_in: match.checked_in || false, // ✅ Mapare esențială pentru feedback
        event: undefined as unknown as StudentEvent,
      };
    } catch (e) {
      return null;
    }
  },

  async getMyEnrollments(): Promise<any[]> {
    const token = getToken();
    if (!token) return [];
    const response = await fetch(`${API_BASE_URL}/registrations/myevents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? response.json() : [];
  },

  async cancelEnrollment(eventId: string): Promise<void> {
    const token = getToken();
    if (!token) return;
    const response = await fetch(
      `${API_BASE_URL}/registrations/events/${eventId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Eroare la anulare.");
  },
};
