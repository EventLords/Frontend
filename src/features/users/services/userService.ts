export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl?: string | null;
}

// Asigură-te că portul este cel corect (3001 pt NestJS)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("token")
  );
};

export const userService = {
  // GET: Profilul curent
  async getProfile(): Promise<UserProfile> {
    const token = getToken();
    if (!token) throw new Error("Nu ești autentificat.");

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Nu am putut încărca profilul.");
    }

    const data = await response.json();

    return {
      id: data.id_user,
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      email: data.email,
      role: (data.role || "student").toLowerCase(),
      createdAt: data.created_at,
      avatarUrl: null, // Backend-ul actual nu trimite URL avatar, gestionăm local sau extindem backend
    };
  },

  // PATCH: Update Profil
  async updateProfile(data: {
    firstName: string;
    lastName: string;
  }): Promise<void> {
    const token = getToken();
    if (!token) throw new Error("Nu ești autentificat.");

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
      }),
    });

    if (!response.ok) {
      throw new Error("Nu am putut actualiza profilul.");
    }
  },
};
